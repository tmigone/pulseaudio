import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Source } from '../../types/pulseaudio'
import { PA_NO_VALUE } from '../../protocol'
import { parseSourcePacket } from '.'

interface GetSource extends PACommand<Source> {
  query: (requestId: number, source: number | string) => PAPacket
}

const query = (requestId: number, source: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SOURCE_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof source === 'number' ? source : PA_NO_VALUE)
  packet.putString(typeof source === 'string' ? source : '')
  return packet
}

const reply = (packet: PAPacket, protocol: number): Source => {
  const sinks = parseSourcePacket(packet, protocol)
  if (sinks.length !== 1) {
    throw new Error('Expected exactly one sink!')
  }
  return sinks[0]
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const GetSource: GetSource = {
  query,
  reply
}

export default GetSource
