import { EventEmitter } from 'events'
import { Socket } from 'net'
import { authenticate, authenticateReply, PACommandType } from './command'
import PAPacket from './packet'
import PARequest, { PAResponse } from './request'
import { PATag } from './tag'
import { PA_PROTOCOL_VERSION, PA_MAX_REQUEST_ID } from './protocol'
import { setClientName } from './commands/clientName'

interface TCPSocket {
  port: number
  host: string
}

export default class PAClient extends EventEmitter {

  pulseAddress: TCPSocket
  pulseCookie: string = '780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074'
  private socket: Socket
  private chunks: Buffer[] = []
  private requests: PARequest[] = []
  private lastRequestId: number = 0
  private connected: boolean = false

  constructor(address: string) {
    super()
    this.parseAddress(address)
  }

  connect(): Promise<PAResponse> {
    return new Promise<PAResponse>((resolve, reject) => {
      this.socket = new Socket()
      this.socket.connect(this.pulseAddress.port, this.pulseAddress.host)
      this.socket.on('connect', async () => {
        this.connected = true

        // Authenticate client
        let reply: PAResponse = await this.authenticate()
        console.log(`Connected to PulseAudio at ${this.pulseAddress.host}:${this.pulseAddress.port}`)
        console.log(`Server protocol version: ${reply.protocol}`)
        console.log(`Client protocol version: ${PA_PROTOCOL_VERSION}`)

        resolve(reply)
      })
      this.socket.on('readable', this.onReadable.bind(this))
      this.socket.on('error', reject)
    })
  }

  authenticate(): Promise<PAResponse> {
    const query: PAPacket = authenticate(this.requestId(), Buffer.from(this.pulseCookie, 'hex'))
    return this.sendRequest(query)
  }

  setClientName(clientName?: string): Promise<PAResponse> {
    const query: PAPacket = setClientName(this.requestId(), clientName)
    return this.sendRequest(query)
  }

  private onReadable(): void {
    // Don't read if we don't have at least 10 bytes
    if (this.socket.readableLength < 10) {
      console.log('Malformed packet!')
      return
    }

    let chunk: Buffer = this.socket.read(this.socket.readableLength)

    // If it's a new packet, discard previous chunks
    if (PAPacket.isChunkHeader(chunk)) {
      this.chunks = []
    }

    // Save new chunk
    this.chunks.push(chunk)

    // Once we get the entire package fulfill the request promise
    if (PAPacket.isValidPacket(this.chunks)) {
      const packet: PAPacket = new PAPacket(Buffer.concat(this.chunks))
      this.resolveRequest(packet)
      this.chunks = []
    }
  }

  private requestId(): number {
    return this.lastRequestId = this.lastRequestId++ & PA_MAX_REQUEST_ID
  }

  private async sendRequest(query: PAPacket): Promise<PAResponse> {
    const request: PARequest = new PARequest(this.lastRequestId, query)
    this.requests.push(request)

    if (!this.connected && query.command.value !== PACommandType.PA_COMMAND_AUTH.toString().charCodeAt(0)) {
      return this.rejectRequest(request, new Error('No connection to PulseAudio.'))
    }

    this.socket.write(request.query.write())
    return request.promise
  }

  private resolveRequest(reply: PAPacket): void {
    const request: PARequest | undefined = this.requests.find(r => r.id === reply.requestId.value)
    request?.resolve(this.parseReply(reply, request.query.command))
    this.requests = this.requests.filter(r => r.id !== reply.requestId.value)
  }

  private rejectRequest(request: PARequest, error: Error): void {
    request.reject(error)
    this.requests = this.requests.filter(r => r.id !== request.id)
  }

  private parseReply(reply: PAPacket, query: PATag<any>): any {
    let retObj: object = {}
    switch (query.value) {
      case PACommandType.PA_COMMAND_AUTH:
        retObj = authenticateReply(reply)
        break
      default:
        console.log('wat')
    }
    return retObj
  }

  private parseAddress(address: string): void {
    // tcp:pulseaudio:4317
    if (address.includes('tcp')) {
      const split: string[] = address.split(':')
      this.pulseAddress = {
        port: parseInt(split[2] ?? '4317'),
        host: split[1]
      }
    }
    // unix:/run/pulse/pulseaudio.socket
    // else if (address.includes('unix')) {
    //   const split: string[] = address.split(':')
    //   this.socketAddress = {
    //     path: split[1]
    //   }
    // }
    // pulseaudio:4317
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
}