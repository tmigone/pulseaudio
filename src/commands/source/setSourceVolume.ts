import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { ChannelVolume, VolumeInfo } from '../../types/pulseaudio'
import { PA_NO_VALUE } from '../../protocol'

interface SetSourceVolume extends PACommand<VolumeInfo> {
  query: (requestId: number, source: number | string, channelVolumes: ChannelVolume) => PAPacket
}

const query = (requestId: number, source: number | string, channelVolumes: ChannelVolume): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_SOURCE_VOLUME)
  packet.setRequestId(requestId)
  packet.putU32(typeof source === 'number' ? source : PA_NO_VALUE)
  packet.putString(typeof source === 'string' ? source : '')
  packet.putChannelVolume({ channels: channelVolumes.channels, volumes: channelVolumes.volumes.map(v => Math.max(Math.min(v, 0xFFFFFFFE), 0)) })
  return packet
}

const reply = (_packet: PAPacket, _protocol: number): VolumeInfo => {
  // Looks like the reply has no data?
  return { success: true }
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const SetSourceVolume: SetSourceVolume = {
  query,
  reply
}

export default SetSourceVolume
