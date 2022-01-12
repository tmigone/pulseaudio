import PAPacket, { TagIterator } from '../packet'
import { PACommandType } from './common'
import { PATag } from '../tag'
import { Sink, ChannelVolume, VolumeInfo, SinkPort } from '../types/pulseaudio'
import { PA_NO_VALUE } from '../protocol'

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L136
const parseSinks = (packet: PAPacket, protocol: number): Sink[] => {
  let sinks: Sink[] = []
  const tags: TagIterator<PATag<any>> = packet.getTagsIterable()

  while (!tags.done) {
    let sink: Sink = {
      index: tags.getNext(),
      name: tags.getNext(),
      description: tags.getNext(),
      sampleSpec: tags.getNext(),
      channelMap: tags.getNext(),
      moduleIndex: tags.getNext(),
      channelVolumes: tags.getNext(),
      isMuted: tags.getNext(),
      monitorSourceIndex: tags.getNext(),
      monitorSourceName: tags.getNext(),
      latency: tags.getNext(),
      driverName: tags.getNext(),
      flagsRaw: tags.getNext(),
      properties: tags.getNext(),
      configLatency: tags.getNext(),
      baseVolume: tags.getNext(),
      state: tags.getNext(),
      volumeSteps: tags.getNext(),
      cardIndex: tags.getNext(),
      numberPorts: tags.getNext()
    }

    sink.ports = []
    for (let sinkIndex = 0; sinkIndex < sink.numberPorts; sinkIndex++) {
      const port: SinkPort = {
        name: tags.getNext(),
        description: tags.getNext(),
        priority: tags.getNext(),
        availabe: tags.getNext()
      }

      if (protocol >= 34) {
        port.availabilityGroup = tags.getNext()
        port.type = tags.getNext()
      }
    }
    
    sink.activePortName = tags.getNext()
    sink.formats = tags.getNext()

    sinks.push(sink)
  }

  return sinks
}

export const getSinks = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
export const getSinksReply = (packet: PAPacket, protocol: number): Sink[] => {
  return parseSinks(packet, protocol)
}

export const getSink = (requestId: number, sink: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : PA_NO_VALUE)
  packet.putString(typeof sink === 'string' ? sink : '')
  return packet
}
export const getSinkReply = (packet: PAPacket, protocol: number): Sink => {
  return parseSinks(packet, protocol)[0]
}

export const setSinkVolume = (requestId: number, sink: number | string, channelVolumes: ChannelVolume): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_SET_SINK_VOLUME)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : PA_NO_VALUE)
  packet.putString(typeof sink === 'string' ? sink : '')
  packet.putChannelVolume({ channels: channelVolumes.channels, volumes: channelVolumes.volumes.map(v => Math.max(Math.min(v, 0xFFFFFFFE), 0)) })
  return packet
}

export const setSinkVolumeReply = (): VolumeInfo => {
  // Looks like the reply has no data?
  return { success: true }
}