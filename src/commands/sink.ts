import PAPacket from '../packet'
import { PACommandType } from './common'
import { ChannelVolume } from '../tags/channelVolume'
import { PATag } from '../tag'

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

export const getSinks = (requestId: number) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
export const getSinksReply = (packet: PAPacket): object => {
  return tagsToObject(packet.tags, sinkKeys)
}

export const getSink = (requestId: number, sink: number | string) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : 0xFFFFFFFF)
  packet.putString(typeof sink === 'string' ? sink : '')
  return packet
}
export const getSinkReply = (packet: PAPacket): object => {
  return tagsToObject(packet.tags, sinkKeys)[0]
}

export const setSinkVolume = (requestId: number, sink: number | string, channelVolumes: ChannelVolume) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_SET_SINK_VOLUME)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : 0xFFFFFFFF)
  packet.putString(typeof sink === 'string' ? sink : '')
  packet.putChannelVolume({ channels: channelVolumes.channels, volumes: channelVolumes.volumes.map(v => Math.max(Math.min(v, 0xFFFFFFFE), 0)) })
  return packet
}

/* @ts-ignore */
export const setSinkVolumeReply = (packet: PAPacket): object => {
  // Looks like the reply has no data
  return { success: true }
}

function tagsToObject(tags: PATag<any>[], keyNames: string[]) {
  const values: any[] = tags.map(t => t.value)
  return new Array(Math.floor(values.length / keyNames.length))
    .fill(0)
    .map(() => values.splice(0, keyNames.length))
    .map(pv => keyNames.map((p, i) => [p, pv[i]]))
    .map(pv => Object.fromEntries(pv))
}