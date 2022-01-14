import { PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { PA_NO_VALUE } from '../../protocol'
import { PATag } from '../../tag'
import { SinkInput } from '../../types/pulseaudio'

const sinkInputKeys: string[] = [
  'index',
  'name',
  'ownerModule',
  'unknown0', // Unknowns
  'sinkIndex',
  'sampleSpec',
  'channelMap',
  'channelVolumes',
  'unknown1', // Unknowns
  'unknown2', // Unknowns
  'resampleMethod',
  'driverName',
  'unknown3', // Unknowns
  'properties',
  'unknown4', // Unknowns
  'unknown5', // Unknowns
  'unknown6', // Unknowns
  'format'
]

export const getSinkInput = (requestId: number, sinkInput: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INPUT_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sinkInput === 'number' ? sinkInput : PA_NO_VALUE)
  return packet
}

export const getSinkInputReply = (packet: PAPacket): SinkInput => {
  return PATag.toObject(packet.tags, sinkInputKeys)[0]
}

