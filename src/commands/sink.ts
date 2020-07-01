import PAPacket from '../packet'
import { PACommandType } from './common'
import { ChannelVolume } from '../tags/channelVolume'

export const getSinks = (requestId: number) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}
export const getSinksReply = (packet: PAPacket): object => {
  const propNames: string[] = [
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
  const propValues: any[] = packet.tags.map(t => t.value)

  return new Array(Math.floor(propValues.length / propNames.length))
    .fill(0)
    .map(() => propValues.splice(0, propNames.length))
    .map(pv => propNames.map((p, i) => [p, pv[i]]))
    .map(pv => Object.fromEntries(pv))
}

export const setSinkVolume = (requestId: number, sink: number | string, channelVolumes: ChannelVolume) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_SET_SINK_VOLUME)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : 0xFFFFFFFF)
  packet.putString(typeof sink === 'string' ? sink : '')
  packet.putChannelVolume({ channels: channelVolumes.channels, volumes: channelVolumes.volumes.map(v => Math.max(Math.min(v, 0xFFFFFFFE), 0)) })
  console.log(packet.write().toString('hex'));
   
  return packet
}

/* @ts-ignore */
export const setSinkVolumeReply = (packet: PAPacket): object => {
  // Looks like the reply has no data
  return { success: true }
}