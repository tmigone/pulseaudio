import PAPacket from '../packet'
import { PACommandType } from './common'
import { PA_PROTOCOL_VERSION } from '../protocol'
import { AuthInfo } from '../types/pulseaudio'

export const authenticate = (requestId: number, cookie: Buffer): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_AUTH)
  packet.setRequestId(requestId)
  packet.putU32(PA_PROTOCOL_VERSION)
  packet.putArbitrary(cookie)
  return packet
}

export const authenticateReply = (packet: PAPacket): AuthInfo => {
  return {
    protocol: packet.tags[0].value
  }
}