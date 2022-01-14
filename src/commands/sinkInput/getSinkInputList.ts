import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { SinkInput } from '../../types/pulseaudio'
import { parseSinkInputPacket } from '.'

interface GetSinkInputList extends PACommand<SinkInput[]> {
  query (requestId: number): PAPacket
}

const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INPUT_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}

const reply = (packet: PAPacket, _protocol: number): SinkInput[] => {
  return parseSinkInputPacket(packet)
}

const GetSinkInputList: GetSinkInputList = {
  query,
  reply
}

export default GetSinkInputList