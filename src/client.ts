import { EventEmitter } from 'events'
import { readFileSync } from 'fs'
import { Socket } from 'net'
import PAPacket from './packet'
import PARequest from './request'
import { PATag } from './tag'
import { PA_MAX_REQUEST_ID, PA_PROTOCOL_MINIMUM_VERSION } from './protocol'
import { PASubscriptionEventType, PAEvent } from './event'
import { PAError } from './error'
import {
  AuthInfo,
  ClientInfo,
  Module,
  ServerInfo,
  Sink,
  SinkInput,
  SubscribeInfo,
  VolumeInfo
} from './types/pulseaudio'

import { SetClientName } from './commands/client'
import { PA_NATIVE_COMMAND_NAMES } from './commands'
import { GetSink, GetSinkList, SetSinkVolume } from './commands/sink'
import { Authenticate, GetServerInfo, Subscribe } from './commands/server'
import { GetSinkInput, GetSinkInputList, MoveSinkInput } from './commands/sinkInput'
import { GetModule, GetModuleList, LoadModule, UnloadModule } from './commands/module'

interface TCPSocket {
  port: number
  host: string
}

export default class PAClient extends EventEmitter {

  public pulseAddress: TCPSocket
  public pulseCookie: Buffer = Buffer.allocUnsafe(256)
  public connected: boolean = false
  private socket: Socket
  private chunks: Buffer[] = []
  private requests: PARequest[] = []
  private lastRequestId: number = 0
  private protocol: number = 0

  constructor(address: string, cookiePath?: string) {
    super()
    this.parseAddress(address)
    if (cookiePath) this.parseCookie(cookiePath)
  }

  // Client APIs
  connect(): Promise<AuthInfo> {
    return new Promise<AuthInfo>((resolve, reject) => {
      this.socket = new Socket()
      this.socket.setTimeout(5_000)
      this.socket.connect(this.pulseAddress.port, this.pulseAddress.host)
      this.socket.on('connect', async () => {
        this.connected = true

        // Authenticate client
        let reply: AuthInfo = await this.authenticate()
        this.protocol = reply.protocol
        console.log(`Connected to PulseAudio at ${this.pulseAddress.host}:${this.pulseAddress.port} using protocol v${this.protocol}`)

        if (reply.protocol < PA_PROTOCOL_MINIMUM_VERSION) {
          console.log(`Server protocol version is too low, please update to ${PA_PROTOCOL_MINIMUM_VERSION} or higher.`)
          this.disconnect()
          reject()
        }

        resolve(reply)
      })
      this.socket.on('readable', this.onReadable.bind(this))
      this.socket.on('error', reject)
      this.socket.on('timeout', () => {
        console.log(`Socket timed out! Cannot reach PulseAudio server at ${this.pulseAddress.host}:${this.pulseAddress.port}`)
        this.disconnect()
      });
    })
  }

  disconnect(): void {
    this.socket.removeAllListeners()
    this.socket.end()
  }

  authenticate(): Promise<AuthInfo> {
    const query: PAPacket = Authenticate.query(this.requestId(), this.pulseCookie)
    return this.sendRequest(query)
  }

  subscribe(): Promise<SubscribeInfo> {
    const query: PAPacket = Subscribe.query(this.requestId())
    return this.sendRequest(query)
  }

  setClientName(clientName?: string): Promise<ClientInfo> {
    const query: PAPacket = SetClientName.query(this.requestId(), clientName)
    return this.sendRequest(query)
  }

  getServerInfo(): Promise<ServerInfo> {
    const query: PAPacket = GetServerInfo.query(this.requestId())
    return this.sendRequest(query)
  }

  getSink(sink: number | string): Promise<Sink> {
    const query: PAPacket = GetSink.query(this.requestId(), sink)
    return this.sendRequest(query)
  }

  getSinkList(): Promise<Sink[]> {
    const query: PAPacket = GetSinkList.query(this.requestId())
    return this.sendRequest(query)
  }

  setSinkVolume(sink: number | string, volume: number): Promise<VolumeInfo> {
    const query: PAPacket = SetSinkVolume.query(this.requestId(), sink, { channels: 2, volumes: [volume, volume] })
    return this.sendRequest(query)
  }

  getSinkInputList(): Promise<Sink[]> {
    const query: PAPacket = GetSinkInputList.query(this.requestId())
    return this.sendRequest(query)
  }

  getSinkInput(sinkInput: number | string): Promise<SinkInput> {
    const query: PAPacket = GetSinkInput.query(this.requestId(), sinkInput)
    return this.sendRequest(query)
  }

  moveSinkInput(sinkInput: number, destSink: number): Promise<any> {
    const query: PAPacket = MoveSinkInput.query(this.requestId(), sinkInput, destSink)
    return this.sendRequest(query)
  }

  getModule(moduleIndex: number): Promise<Module> {
    const query: PAPacket = GetModule.query(this.requestId(), moduleIndex)
    return this.sendRequest(query)
  }

  getModuleList(): Promise<Module> {
    const query: PAPacket = GetModuleList.query(this.requestId())
    return this.sendRequest(query)
  }

  loadModule(name: string, argument: string): Promise<Module> {
    const query: PAPacket = LoadModule.query(this.requestId(), name, argument)
    return this.sendRequest(query) 
  }

  unloadModule(moduleIndex: number): Promise<Module> {
    const query: PAPacket = UnloadModule.query(this.requestId(), moduleIndex)
    return this.sendRequest(query) 
  }


  // Private methods
  private onReadable(): void {
    // Don't read if we don't have at least 10 bytes
    if (this.socket.readableLength < 10) {
      console.log('Malformed packet!')
      let malformed: Buffer = this.socket.read(this.socket.readableLength)
      console.log(malformed);
      return
    }

    let chunk: Buffer = this.socket.read(this.socket.readableLength)

    // Discard previous chunks if we get a new packet header and stil have pending chunks
    // This should not happen really, if it does it's probably a bug
    if (PAPacket.isChunkHeader(chunk) && this.chunks.length > 0) {
      console.log('WARNING: discarding chunks, this might be a bug...')
      this.chunks = []
    }

    // Save new chunk
    this.chunks.push(chunk)

    // Once we get the entire package fulfill the request promise
    // Chunks can contain more than one packet so we loop until we are done
    while (PAPacket.isValidPacket(this.chunks)) {
      const packet: PAPacket = new PAPacket(Buffer.concat(this.chunks))
      this.resolveRequest(packet)
      this.chunks = PAPacket.getChunksSize(this.chunks) === packet.packet.length ? [] : [Buffer.concat(this.chunks).subarray(packet.packet.length)]
    }
  }

  private requestId(): number {
    this.lastRequestId = (this.lastRequestId + 1) & PA_MAX_REQUEST_ID
    return this.lastRequestId
  }

  private async sendRequest(query: PAPacket): Promise<any> {
    const request: PARequest = new PARequest(this.lastRequestId, query)
    this.requests.push(request)

    if (!this.connected && query.command.value !== PA_NATIVE_COMMAND_NAMES.PA_COMMAND_AUTH.toString().charCodeAt(0)) {
      return this.rejectRequest(request, new Error('No connection to PulseAudio.'))
    }

    this.socket.write(request.query.write())
    return request.promise
  }

  private resolveRequest(reply: PAPacket): void {
    let request: PARequest | undefined
    switch (reply.command.value) {
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_ERROR:
        request = this.requests.find(r => r.id === reply.requestId.value)
        request?.resolve({ success: false, error: PAError[reply.tags[0].value] })
        this.requests = this.requests.filter(r => r.id !== reply.requestId.value)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_REPLY:
        request = this.requests.find(r => r.id === reply.requestId.value)
        request?.resolve(this.parseReply(reply, request.query.command))
        this.requests = this.requests.filter(r => r.id !== reply.requestId.value)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SUBSCRIBE_EVENT:
        const event: PAEvent = this.parseEvent(reply)
        this.emit(event.category, event)
        this.emit('all', event)
        break
      default:
        throw new Error(`Reply type ${reply.command.value} not supported. Please report issue.`)
    }
  }

  private rejectRequest(request: PARequest, error: Error): void {
    request.reject(error)
    this.requests = this.requests.filter(r => r.id !== request.id)
  }

  private parseReply(reply: PAPacket, query: PATag<any>): any {
    let retObj: any = {}

    switch (query.value) {
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_AUTH:
        retObj = Authenticate.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SERVER_INFO:
        retObj = GetServerInfo.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SUBSCRIBE:
        retObj = Subscribe.reply(reply, this.protocol)
        break        
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_CLIENT_NAME:
        retObj = SetClientName.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INFO_LIST:
        retObj = GetSinkList.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INFO:
        retObj = GetSink.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_SINK_VOLUME:
        retObj = SetSinkVolume.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INPUT_INFO:
        retObj = GetSinkInput.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INPUT_INFO_LIST:
        retObj = GetSinkInputList.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_MOVE_SINK_INPUT:
        retObj = MoveSinkInput.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_MODULE_INFO:
        retObj = GetModule.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_MODULE_INFO_LIST:
        retObj = GetModuleList.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_LOAD_MODULE:
        retObj = LoadModule.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_UNLOAD_MODULE:
        retObj = UnloadModule.reply(reply, this.protocol)
        break
      default:
        throw new Error(`Command ${query.value} not supported. Please report issue.`)
    }
    return retObj
  }

  private parseEvent(packet: PAPacket): PAEvent {
    const details: number = packet.tags[0].value
    const index: number = packet.tags[1].value

    // Parse category
    let category: string = ''
    switch (details & PASubscriptionEventType.FACILITY_MASK) {
      case PASubscriptionEventType.SINK:
        category = 'sink'
        break;
      case PASubscriptionEventType.SOURCE:
        category = 'source'
        break;
      case PASubscriptionEventType.SINK_INPUT:
        category = 'sinkInput'
        break;
      case PASubscriptionEventType.SOURCE_OUTPUT:
        category = 'sourceOutput'
        break;
      case PASubscriptionEventType.MODULE:
        category = 'module'
        break;
      case PASubscriptionEventType.CLIENT:
        category = 'client'
        break;
      case PASubscriptionEventType.SAMPLE_CACHE:
        category = 'sampleCache'
        break;
      case PASubscriptionEventType.SERVER:
        category = 'server'
        break;
      case PASubscriptionEventType.AUTOLOAD:
        category = 'autoload'
        break;
      case PASubscriptionEventType.CARD:
        category = 'card'
        break;
      default:
        throw new Error(`Details type ${details} not supported. Please report issue.`)
    }

    // Parse event type
    let type: string = ''
    switch (details & PASubscriptionEventType.TYPE_MASK) {
      case PASubscriptionEventType.NEW:
        type = 'new'
        break
      case PASubscriptionEventType.CHANGE:
        type = 'change'
        break
      case PASubscriptionEventType.REMOVE:
        type = 'remove'
        break
      default:
        throw new Error(`Event type ${details} not supported. Please report issue.`)
    }

    return {
      index,
      category,
      type
    }
  }

  private parseAddress(address: string): void {
    // reference = tcp:pulseaudio:4317
    if (address.includes('tcp')) {
      const split: string[] = address.split(':')
      this.pulseAddress = {
        port: parseInt(split[2] ?? '4317'),
        host: split[1]
      }
    }
    // reference = unix:/run/pulse/pulseaudio.socket
    // else if (address.includes('unix')) {
    //   const split: string[] = address.split(':')
    //   this.socketAddress = {
    //     path: split[1]
    //   }
    // }
    // reference = pulseaudio:4317
    else if (address.includes(':')) {
      const split: string[] = address.split(':')
      this.pulseAddress = {
        port: parseInt(split[1] ?? '4317'),
        host: split[0]
      }
    }
    else {
      throw new Error('Unrecognized server address format. Please use "tcp:host:port", "unix:/path/to/socket" or "host:port".')
    }
  }

  private parseCookie(cookiePath: string): void {
    try {
      this.pulseCookie = Buffer.from(readFileSync(cookiePath, 'hex'), 'hex')
    } catch (error) {
      console.log(`Error reading cookie file, might not be able to authenticate.`)
      console.log(error)
    }
  }
}