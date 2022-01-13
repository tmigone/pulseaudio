import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Sink } from '../../types/pulseaudio'
import { PA_NO_VALUE } from '../../protocol'
import { parseSinks } from '.'

const query = (requestId: number, sink: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : PA_NO_VALUE)
  packet.putString(typeof sink === 'string' ? sink : '')
  return packet
}

const reply = (packet: PAPacket, protocol: number): Sink => {
  return parseSinks(packet, protocol)[0]
}

const GetSink: PACommand<Sink> = {
  query,
  reply
}

export default GetSink