import { EventEmitter } from "events"
import { Socket } from "dgram"
// import { Socket } from "net"

interface TCPSocket {
  port: number
  host: string
}

interface UnixSocket {
  path: string
}

export default class PAClient extends EventEmitter {

  socket: Socket
  socketAddress: TCPSocket | UnixSocket

  constructor (address: string) {
    super()
    this.parseAddress(address)
  }

  connect () {
    this.socket = new Socket()
  }

  private parseAddress (address: string): void {
    // tcp:pulseaudio:4317
    if (address.includes('tcp')) {
      const split: string[] = address.split(':')
      this.socketAddress = {
        port: parseInt(split[2] ?? '4317'),
        host: split[1]
      }
    }
    // unix:/run/pulse/pulseaudio.socket
    else if (address.includes('unix')) {
      const split: string[] = address.split(':')
      this.socketAddress = {
        path: split[1]
      }
    }
    // pulseaudio:4317
    else if (address.includes(':')) {
      const split: string[] = address.split(':')
      this.socketAddress = {
        port: parseInt(split[1] ?? '4317'),
        host: split[0]
      }
    }
    else {
      throw new Error('Unrecognized server address format. Please use "tcp:host:port", "unix:/path/to/socket" or "host:port".')
    }
  }
}