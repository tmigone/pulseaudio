import PAPacket from '../packet'
import { PACommandType } from './common'

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