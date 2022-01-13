import { PACommandType } from '.'
import PAPacket from '../packet'
import { PATag } from '../tag'
import { SinkInput } from '../types/pulseaudio'

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

export const getSinkInputs = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INPUT_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}

export const getSinkInputsReply = (packet: PAPacket): SinkInput[] => {
  return PATag.toObject(packet.tags, sinkInputKeys)
}

export const getSinkInput = (requestId: number, sinkInput: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SINK_INPUT_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sinkInput === 'number' ? sinkInput : 0xFFFFFFFF)
  return packet
}

export const getSinkInputReply = (packet: PAPacket): SinkInput => {
  return PATag.toObject(packet.tags, sinkInputKeys)[0]
}

export const moveSinkInput = (requestId: number, sinkInput: number, destSink: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_MOVE_SINK_INPUT)
  packet.setRequestId(requestId)
  packet.putU32(sinkInput)
  packet.putU32(destSink)
  packet.putString('')
  return packet
}

export const moveSinkInputReply = (_packet: PAPacket): SinkInput => {
  // Looks like the reply has no data
  return { success: true }
}
