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
  Source,
  SourceOutput,
  SubscribeInfo,
  VolumeInfo
} from './types/pulseaudio'

import { SetClientName } from './commands/client'
import { PA_NATIVE_COMMAND_NAMES } from './commands'
import { GetSink, GetSinkList, SetSinkVolume } from './commands/sink'
import { Authenticate, GetServerInfo, Subscribe } from './commands/server'
import { GetSinkInput, GetSinkInputList, MoveSinkInput } from './commands/sinkInput'
import { GetModule, GetModuleList, LoadModule, UnloadModule } from './commands/module'
import { GetSource, GetSourceList, SetSourceVolume } from './commands/source'
import { GetSourceOutput, GetSourceOutputList, MoveSourceOutput } from './commands/sourceOutput'

export interface TCPSocket {
  port: number
  host: string
}

/**
 * Implements the PulseAudio client.
 *
 * @example
 * ```ts
 * import PulseAudio, { Sink } from '@tmigone/pulseaudio'
 *
 * (async () => {
 *   // Connect using tcp socket
 *   const client: PulseAudio = new PulseAudio('tcp:192.168.1.10:4317')
 *   await client.connect()
 *
 *   // Set volume of all sinks to 50%
 *   const sinks: Sink[] = await client.getSinkList()
 *   for (const sink of sinks) {
 *     await client.setSinkVolume(sink.index, 50)
 *   }
 *
 *   // Close connection
 *   client.disconnect()
 * })()
 * ```
 * @noInheritDoc
 */
export default class PulseAudio extends EventEmitter {
  /**
  * @category public
  */
  public address: TCPSocket
  /**
  * @category public
  */
  public cookie: Buffer = Buffer.allocUnsafe(256)
  /**
  * @category public
  */
  public connected: boolean = false
  /**
  * @category public
  */
  public protocol: number = 0
  private socket: Socket
  private chunks: Buffer[] = []
  private requests: PARequest[] = []
  private lastRequestId: number = 0

  /**
  * Instantiate a PulseAudio client by providing the server address.
  * PulseAudio server defaults to the following:
  * - UNIX socket: `/run/user/<user_id>/pulse/native`
  * - TCP port: `4317`
  *
  * ```typescript
  * // Using UNIX socket
  * const client: PulseAudio = new PulseAudio('unix:/run/user/1001/pulse/native')
  *
  * // Using TCP socket
  * const client: PulseAudio = new PulseAudio('tcp:localhost:4317')
  * ```
  * @category PulseAudio
  * @param address The address of the PulseAudio server. Can be either the path to a UNIX domain socket or the network address of the server. For UNIX sockets prepend `unix:` to the path. For TCP sockets the format is `tcp:<host>:<port>`.
  * @param cookie The path to the cookie to use when authenticating with the server. Typically located at `~/.config/pulse/cookie`.
  */
  constructor (address: string, cookie?: string) {
    super()
    this.parseAddress(address)
    if (cookie !== undefined) this.parseCookie(cookie)
  }

  /**
  * Connects the client to the PulseAudio server. Won't retry if the server is not reachable or the connection attempt is refused. Times out after 5 seconds.
  * @category client
  */
  async connect (): Promise<AuthInfo> {
    return await new Promise<AuthInfo>((resolve, reject) => {
      this.socket = new Socket()
      this.socket.connect(this.address.port, this.address.host)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      this.socket.on('connect', async () => {
        this.connected = true

        // Authenticate client
        const reply: AuthInfo = await this.authenticate()
        this.protocol = reply.protocol
        console.log(`Connected to PulseAudio at ${this.address.host}:${this.address.port} using protocol v${this.protocol}`)

        if (reply.protocol < PA_PROTOCOL_MINIMUM_VERSION) {
          this.disconnect()
          reject(new Error(`Server protocol version is too low, please update to ${PA_PROTOCOL_MINIMUM_VERSION} or higher.`))
        }

        resolve(reply)
      })
      this.socket.on('readable', this.onReadable.bind(this))
      this.socket.on('error', reject)
    })
  }

  /**
  * Disconnect the client from the PulseAudio server. Waits for the server to close the connection.
  * @category client
  */
  disconnect (): void {
    this.socket.removeAllListeners()
    this.socket.end()
  }

  /**
  * Specify the client name passed to the server when connecting.
  * @category client
  * @param clientName The client name. Defaults to `paclient`.
  */
  async setClientName (clientName: string = 'paclient'): Promise<ClientInfo> {
    const query: PAPacket = SetClientName.query(this.requestId(), clientName)
    return await this.sendRequest(query)
  }

  private async authenticate (): Promise<AuthInfo> {
    const query: PAPacket = Authenticate.query(this.requestId(), this.cookie)
    return await this.sendRequest(query)
  }

  /**
  * Subscribe to PulseAudio server events.
  * @category server
  */
  async subscribe (): Promise<SubscribeInfo> {
    const query: PAPacket = Subscribe.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Gets PulseAudio server information.
  * @category server
  */
  async getServerInfo (): Promise<ServerInfo> {
    const query: PAPacket = GetServerInfo.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Gets details for the sink instance identified by the specified symbolic name or numeric index.
  * @category sink
  * @param sink The symbolic name or numerical index of the sink instance to get details for.
  */
  async getSink (sink: number | string): Promise<Sink> {
    const query: PAPacket = GetSink.query(this.requestId(), sink)
    return await this.sendRequest(query)
  }

  /**
  * Gets details for all sink instances.
  * @category sink
  */
  async getSinkList (): Promise<Sink[]> {
    const query: PAPacket = GetSinkList.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Sets the volume of the specified sink (identified by its symbolic name or numerical index).
  * @category sink
  * @param sink The symbolic name or numerical index of the sink to set the volume of.
  * @param volume The volume to set the source to in percentage (0% - 100%).
  */
  async setSinkVolume (sink: number | string, volume: number): Promise<VolumeInfo> {
    const query: PAPacket = SetSinkVolume.query(this.requestId(), sink, { channels: 2, volumes: [volume, volume] })
    return await this.sendRequest(query)
  }

  /**
  * Gets details for all sink input instances.
  * @category sinkInput
  */
  async getSinkInputList (): Promise<Sink[]> {
    const query: PAPacket = GetSinkInputList.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Gets details for the sink input instance identified by the specified symbolic name or numeric index.
  * @category sinkInput
  * @param sinkInput The symbolic name or numerical index of the sink input instance to get details for.
  */
  async getSinkInput (sinkInput: number | string): Promise<SinkInput> {
    const query: PAPacket = GetSinkInput.query(this.requestId(), sinkInput)
    return await this.sendRequest(query)
  }

  /**
  * Move the specified playback stream (identified by its numerical index) to the specified sink (identified by its numerical index).
  * @category sinkInput
  * @param sinkInput The numerical index of the playback stream to move.
  * @param sink The numerical index of the sink to move the playback stream to.
  */
  async moveSinkInput (sinkInput: number, sink: number): Promise<any> {
    const query: PAPacket = MoveSinkInput.query(this.requestId(), sinkInput, sink)
    return await this.sendRequest(query)
  }

  /**
  * Gets details for the source instance identified by the specified symbolic name or numeric index.
  * @category source
  * @param source The symbolic name or numerical index of the source instance to get details for.
  */
  async getSource (source: number | string): Promise<Source> {
    const query: PAPacket = GetSource.query(this.requestId(), source)
    return await this.sendRequest(query)
  }

  /**
  * Gets details for all source instances.
  * @category source
  */
  async getSourceList (): Promise<Source[]> {
    const query: PAPacket = GetSourceList.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Sets the volume of the specified source (identified by its symbolic name or numerical index).
  * @category source
  * @param source The symbolic name or numerical index of the source to set the volume of.
  * @param volume The volume to set the source to in percentage (0% - 100%).
  */
  async setSourceVolume (source: number | string, volume: number): Promise<Source> {
    const query: PAPacket = SetSourceVolume.query(this.requestId(), source, { channels: 2, volumes: [volume, volume] })
    return await this.sendRequest(query)
  }

  /**
  * Gets details for the source output instance identified by the specified numeric index.
  * @category sourceOutput
  * @param sourceOutput The numerical index of the source output instance to get details for.
  */
  async getSourceOutput (sourceOutput: number | string): Promise<SourceOutput> {
    const query: PAPacket = GetSourceOutput.query(this.requestId(), sourceOutput)
    return await this.sendRequest(query)
  }

  /**
  * Gets details for all source output instances.
  * @category sourceOutput
  */
  async getSourceOutputList (): Promise<SourceOutput> {
    const query: PAPacket = GetSourceOutputList.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Move the specified recording stream (identified by its numerical index) to the specified source (identified by its numerical index).
  * @category sourceOutput
  * @param sourceOutput The numerical index of the recording stream to move.
  * @param source The numerical index of the source to move the recording stream to.
  */
  async moveSourceOutput (sourceOutput: number, source: number): Promise<SourceOutput> {
    const query: PAPacket = MoveSourceOutput.query(this.requestId(), sourceOutput, source)
    return await this.sendRequest(query)
  }

  /**
  * Gets details for the module instance identified by the specified numeric index.
  * @category module
  * @param module The numerical index of the module instance to get details for.
  */
  async getModule (module: number): Promise<Module> {
    const query: PAPacket = GetModule.query(this.requestId(), module)
    return await this.sendRequest(query)
  }

  /**
  * Gets details for all loaded module instances.
  * @category module
  */
  async getModuleList (): Promise<Module> {
    const query: PAPacket = GetModuleList.query(this.requestId())
    return await this.sendRequest(query)
  }

  /**
  * Load the specified module with the specified arguments into the running sound server. Prints the numeric index of the module just loaded to STDOUT. You can use it to unload the module later.
   *
   * @example
   * ```typescript
   * const moduleIndex = await client.loadModule('module-loopback', 'source=alsa_output.dac.stereo-fallback.monitor sink=app-output')
   * console.log(moduleIndex) // moduleIndex: 27
   * ```
  * @category module
  * @param name The name of the module to load.
  * @param argument Space separated list of arguments to pass to the module.
  */
  async loadModule (name: string, argument: string): Promise<Module> {
    const query: PAPacket = LoadModule.query(this.requestId(), name, argument)
    return await this.sendRequest(query)
  }

  /**
  * Unload the module instance identified by the specified numeric index.
  * @category module
  * @param module The numeric index of the module to unload.
  */
  async unloadModule (module: number): Promise<Module> {
    const query: PAPacket = UnloadModule.query(this.requestId(), module)
    return await this.sendRequest(query)
  }

  // Private methods
  private onReadable (): void {
    // Don't read if we don't have at least 10 bytes
    if (this.socket.readableLength < 10) {
      console.log('Malformed packet!')
      const malformed: Buffer = this.socket.read(this.socket.readableLength)
      console.log(malformed)
      return
    }

    const chunk: Buffer = this.socket.read(this.socket.readableLength)

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

  private requestId (): number {
    this.lastRequestId = (this.lastRequestId + 1) & PA_MAX_REQUEST_ID
    return this.lastRequestId
  }

  private async sendRequest (query: PAPacket): Promise<any> {
    const request: PARequest = new PARequest(this.lastRequestId, query)
    this.requests.push(request)

    if (!this.connected && query.command.value !== PA_NATIVE_COMMAND_NAMES.PA_COMMAND_AUTH.toString().charCodeAt(0)) {
      return this.rejectRequest(request, new Error('No connection to PulseAudio.'))
    }

    this.socket.write(request.query.write())
    return await request.promise
  }

  private resolveRequest (reply: PAPacket): void {
    let request: PARequest | undefined
    let event: PAEvent | undefined
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
        event = this.parseEvent(reply)
        this.emit(event.category, event)
        this.emit('all', event)
        break
      default:
        throw new Error(`Reply type ${reply.command.value} not supported. Please report issue.`)
    }
  }

  private rejectRequest (request: PARequest, error: Error): void {
    request.reject(error)
    this.requests = this.requests.filter(r => r.id !== request.id)
  }

  private parseReply (reply: PAPacket, query: PATag<any>): any {
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
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_INFO:
        retObj = GetSource.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_INFO_LIST:
        retObj = GetSourceList.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_SOURCE_VOLUME:
        retObj = SetSourceVolume.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_OUTPUT_INFO:
        retObj = GetSourceOutput.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_OUTPUT_INFO_LIST:
        retObj = GetSourceOutputList.reply(reply, this.protocol)
        break
      case PA_NATIVE_COMMAND_NAMES.PA_COMMAND_MOVE_SOURCE_OUTPUT:
        retObj = MoveSourceOutput.reply(reply, this.protocol)
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
        throw new Error(`Command ${query.value as string} not supported. Please report issue.`)
    }
    return retObj
  }

  private parseEvent (packet: PAPacket): PAEvent {
    const details: number = packet.tags[0].value
    const index: number = packet.tags[1].value

    // Parse category
    let category: string = ''
    switch (details & PASubscriptionEventType.FACILITY_MASK) {
      case PASubscriptionEventType.SINK:
        category = 'sink'
        break
      case PASubscriptionEventType.SOURCE:
        category = 'source'
        break
      case PASubscriptionEventType.SINK_INPUT:
        category = 'sinkInput'
        break
      case PASubscriptionEventType.SOURCE_OUTPUT:
        category = 'sourceOutput'
        break
      case PASubscriptionEventType.MODULE:
        category = 'module'
        break
      case PASubscriptionEventType.CLIENT:
        category = 'client'
        break
      case PASubscriptionEventType.SAMPLE_CACHE:
        category = 'sampleCache'
        break
      case PASubscriptionEventType.SERVER:
        category = 'server'
        break
      case PASubscriptionEventType.AUTOLOAD:
        category = 'autoload'
        break
      case PASubscriptionEventType.CARD:
        category = 'card'
        break
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

  private parseAddress (address: string): void {
    // reference = tcp:pulseaudio:4317
    if (address.includes('tcp')) {
      const split: string[] = address.split(':')
      this.address = {
        port: parseInt(split[2] ?? '4317'),
        host: split[1]
      }
    } else if (address.includes(':')) {
      const split: string[] = address.split(':')
      this.address = {
        port: parseInt(split[1] ?? '4317'),
        host: split[0]
      }
    } else {
      throw new Error('Unrecognized server address format. Please use "tcp:host:port", "unix:/path/to/socket" or "host:port".')
    }
  }

  private parseCookie (cookiePath: string): void {
    try {
      this.cookie = Buffer.from(readFileSync(cookiePath, 'hex'), 'hex')
    } catch (error) {
      console.log('Error reading cookie file, might not be able to authenticate.')
      console.log(error)
    }
  }
}
