import { PA_NATIVE_COMMAND_NAMES } from '.'
import PAPacket from '../packet'
import { ClientInfo } from '../types/pulseaudio'

export const setClientName = (requestId: number, clientName: string = 'palib-client'): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_CLIENT_NAME)
  packet.setRequestId(requestId)
  packet.putPropList([['application.name', clientName]])
  return packet
}

export const setClientNameReply = (packet: PAPacket): ClientInfo => {
  return {
    index: packet.tags[0].value
  }
}
