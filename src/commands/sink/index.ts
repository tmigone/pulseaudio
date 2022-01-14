import PAPacket from '../../packet'
import { Sink, SinkPort } from '../../types/pulseaudio'

import GetSink from './getSink'
import GetSinkList from './getSinkList'
import SetSinkVolume from './setSinkVolume'

export {
  GetSink,
  GetSinkList,
  SetSinkVolume
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L136
export const parseSinkPacket = (packet: PAPacket, protocol: number): Sink[] => {
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
      channelVolume: tags.nextValue(),
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

      // PulseAudio >= v14.0
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
