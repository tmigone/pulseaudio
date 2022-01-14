import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Sink } from '../../types/pulseaudio'
import { PA_NO_VALUE } from '../../protocol'
import { parseSinkPacket } from '.'

interface GetSink extends PACommand<Sink> {
  query (requestId: number, sink: number | string): PAPacket
}

const query = (requestId: number, sink: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : PA_NO_VALUE)
  packet.putString(typeof sink === 'string' ? sink : '')
  return packet
}

const reply = (packet: PAPacket, protocol: number): Sink => {
  const sinks = parseSinkPacket(packet, protocol)
  if (sinks.length !== 1) {
    throw new Error("Expected exactly one sink!")
  }
  return sinks[0]
}

const GetSink: GetSink = {
  query,
  reply
}

export default GetSink