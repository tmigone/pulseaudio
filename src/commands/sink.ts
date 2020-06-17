import PAPacket from '../packet'
import { PACommandType } from './common'

export const getSinks = (requestId: number) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
export const getSinksReply = (packet: PAPacket): object => {
  console.log(packet.packet.toString('hex'));
  console.log(packet);
  
  
  return {}
}
