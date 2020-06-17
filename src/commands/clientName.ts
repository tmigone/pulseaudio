import PAPacket from '../packet'
import { PACommandType } from './common'

export const setClientName = (requestId: number, clientName: string = 'palib-client'): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_SET_CLIENT_NAME)
  packet.setRequestId(requestId)
  packet.putPropList([['application.name', clientName]])
  return packet
}

export const setClientNameReply = (packet: PAPacket): object => {
  return {
    clientIndex: packet.tags[0].value
  }
}
