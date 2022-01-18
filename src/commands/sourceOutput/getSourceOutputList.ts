import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { SourceOutput } from '../../types/pulseaudio'
import { parseSourceOutputPacket } from '.'

interface GetSourceOutputList extends PACommand<SourceOutput[]> {
  query: (requestId: number) => PAPacket
}

const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_OUTPUT_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}

const reply = (packet: PAPacket, _protocol: number): SourceOutput[] => {
  return parseSourceOutputPacket(packet)
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const GetSourceOutputList: GetSourceOutputList = {
  query,
  reply
}

export default GetSourceOutputList
