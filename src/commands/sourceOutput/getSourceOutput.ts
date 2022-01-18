import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { PA_NO_VALUE } from '../../protocol'
import { SourceOutput } from '../../types/pulseaudio'
import { parseSourceOutputPacket } from '.'

interface GetSourceOutput extends PACommand<SourceOutput> {
  query: (requestId: number, sourceOutput: number | string) => PAPacket
}

const query = (requestId: number, sourceOutput: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_OUTPUT_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sourceOutput === 'number' ? sourceOutput : PA_NO_VALUE)
  return packet
}

const reply = (packet: PAPacket, _protocol: number): SourceOutput => {
  const sourceOutputs = parseSourceOutputPacket(packet)
  if (sourceOutputs.length !== 1) {
    throw new Error('Expected exactly one sourceOutput!')
  }
  return sourceOutputs[0]
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const GetSourceOutput: GetSourceOutput = {
  query,
  reply
}

export default GetSourceOutput
