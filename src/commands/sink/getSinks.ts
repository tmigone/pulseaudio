import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Sink } from '../../types/pulseaudio'
import { parseSinks } from '.'

interface GetSinks extends PACommand<Sink[]> {
  query (requestId: number): PAPacket
}

export const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
export const reply = (packet: PAPacket, protocol: number): Sink[] => {
  return parseSinks(packet, protocol)
}

const GetSinks: GetSinks = {
  query,
  reply
}

export default GetSinks