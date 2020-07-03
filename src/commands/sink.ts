import PAPacket from '../packet'
import { PACommandType } from './common'
import { PATag } from '../tag'
import { Sink, ChannelVolume } from '../types/pulseaudio'

const sinkKeys: string[] = [
  'index',
  'name',
  'description',
  'sampleSpec',
  'channelMap',
  'moduleIndex',
  'channelVolumes',
  'isMuted',
  'monitorSourceIndex',
  'monitorSourceName',
  'latency',
  'driverName',
  'flagsRaw',
  'properties',
  'configLatency',
  'baseVolume',
  'state',
  'volumeSteps',
  'cardIndex',
  'ports',
  'activePortName',
  'formats'
]

export const getSinks = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
export const getSinksReply = (packet: PAPacket): Sink[] => {
  return PATag.toObject(packet.tags, sinkKeys)
}

export const getSink = (requestId: number, sink: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : 0xFFFFFFFF)
  packet.putString(typeof sink === 'string' ? sink : '')
  return packet
}
export const getSinkReply = (packet: PAPacket): Sink => {
  return PATag.toObject(packet.tags, sinkKeys)[0]
}

export const setSinkVolume = (requestId: number, sink: number | string, channelVolumes: ChannelVolume): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_SET_SINK_VOLUME)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : 0xFFFFFFFF)
  packet.putString(typeof sink === 'string' ? sink : '')
  packet.putChannelVolume({ channels: channelVolumes.channels, volumes: channelVolumes.volumes.map(v => Math.max(Math.min(v, 0xFFFFFFFE), 0)) })
  return packet
}

/* @ts-ignore */
export const setSinkVolumeReply = (packet: PAPacket): PAVolumeInfo => {
  // Looks like the reply has no data
  return { success: true }
}