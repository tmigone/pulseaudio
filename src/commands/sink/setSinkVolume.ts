import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { ChannelVolume, VolumeInfo } from '../../types/pulseaudio'
import { PA_NO_VALUE } from '../../protocol'

export const query = (requestId: number, sink: number | string, channelVolumes: ChannelVolume): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_SINK_VOLUME)
  packet.setRequestId(requestId)
  packet.putU32(typeof sink === 'number' ? sink : PA_NO_VALUE)
  packet.putString(typeof sink === 'string' ? sink : '')
  packet.putChannelVolume({ channels: channelVolumes.channels, volumes: channelVolumes.volumes.map(v => Math.max(Math.min(v, 0xFFFFFFFE), 0)) })
  return packet
}

export const reply = (_packet: PAPacket, _protocol: number): VolumeInfo => {
  // Looks like the reply has no data?
  return { success: true }
}

const SetSinkVolume: PACommand<VolumeInfo> = {
  query,
  reply
}

export default SetSinkVolume