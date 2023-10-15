import PAPacket from '../../packet'
import { Source, Port } from '../../types/pulseaudio'

import GetSource from './getSource'
import GetSourceList from './getSourceList'
import SetSourceVolume from './setSourceVolume'

export {
  GetSource,
  GetSourceList,
  SetSourceVolume
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L136
export const parseSourcePacket = (packet: PAPacket, protocol: number): Source[] => {
  const sources: Source[] = []
  const tags = packet.getTagsIterable()

  while (!tags.done) {
    const source: Source = {
      index: tags.nextValue(),
      name: tags.nextValue(),
      description: tags.nextValue(),
      sampleSpec: tags.nextValue(),
      channelMap: tags.nextValue(),
      moduleIndex: tags.nextValue(),
      channelVolume: tags.nextValue(),
      isMuted: tags.nextValue(),
      monitorSinkIndex: tags.nextValue(),
      monitorSinkName: tags.nextValue(),
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

    source.ports = []
    for (let index = 0; index < source.numberPorts; index++) {
      const port: Port = {
        name: tags.nextValue(),
        description: tags.nextValue(),
        priority: tags.nextValue(),
        available: tags.nextValue()
      }

      // PulseAudio >= v14.0
      if (protocol >= 34) {
        port.availabilityGroup = tags.nextValue()
        port.type = tags.nextValue()
      }

      source.ports.push(port)
    }

    source.activePortName = tags.nextValue()
    source.formats = tags.nextValue()

    sources.push(source)
  }

  return sources
}
