import PAPacket from '../packet'
import { PACommandType } from './common'

export const getSinks = (requestId: number) => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INFO_LIST)
  packet.setRequestId(requestId)
  console.log(packet.write().toString('hex'));
  
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
  const propArray: [string, any][] = propNames.map((p, i) => [p, propValues[i]])
  return Object.fromEntries(propArray)
}