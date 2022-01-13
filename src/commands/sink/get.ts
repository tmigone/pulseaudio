import { PACommand, PACommandType } from '../'
import PAPacket from '../../packet'
import { Sink, SinkPort } from '../../types/pulseaudio'
import { PA_NO_VALUE } from '../../protocol'

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L136
const parseSinks = (packet: PAPacket, protocol: number): Sink[] => {
  const sinks: Sink[] = []
  const tags = packet.getTagsIterable()

  while (!tags.done) {
    const sink: Sink = {
      index: tags.nextValue(),
      name: tags.nextValue(),
      description: tags.nextValue(),
      sampleSpec: tags.nextValue(),
      channelMap: tags.nextValue(),
      moduleIndex: tags.nextValue(),
      channelVolumes: tags.nextValue(),
      isMuted: tags.nextValue(),
      monitorSourceIndex: tags.nextValue(),
      monitorSourceName: tags.nextValue(),
      latency: tags.nextValue(),
      driverName: tags.nextValue(),
      flagsRaw: tags.nextValue(),
      properties: tags.nextValue(),
      configLatency: tags.nextValue(),
      baseVolume: tags.nextValue(),
      state: tags.nextValue(),
      volumeSteps: tags.nextValue(),
      cardIndex: tags.nextValue(),
      numberPorts: tags.nextValue()
    }

    sink.ports = []
    for (let sinkIndex = 0; sinkIndex < sink.numberPorts; sinkIndex++) {
      const port: SinkPort = {
        name: tags.nextValue(),
        description: tags.nextValue(),
        priority: tags.nextValue(),
        availabe: tags.nextValue()
      }

      if (protocol >= 34) {
        port.availabilityGroup = tags.nextValue()
        port.type = tags.nextValue()
      }
    }

    sink.activePortName = tags.nextValue()
    sink.formats = tags.nextValue()

    sinks.push(sink)
  }

  return sinks
}

const query = (requestId: number, sink: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : PA_NO_VALUE)
  packet.putString(typeof sink === 'string' ? sink : '')
  return packet
}
const reply = (packet: PAPacket, protocol: number): Sink => {
  return parseSinks(packet, protocol)[0]
}

export const GetSink: PACommand<Sink> = {
  query,
  reply
}
