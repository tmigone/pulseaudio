import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Source } from '../../types/pulseaudio'
import { parseSourcePacket } from '.'

interface GetSourceList extends PACommand<Source[]> {
  query (requestId: number): PAPacket
}

const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
const reply = (packet: PAPacket, protocol: number): Source[] => {
  return parseSourcePacket(packet, protocol)
}

const GetSourceList: GetSourceList = {
  query,
  reply
}

export default GetSourceList