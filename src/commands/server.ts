import PAPacket from '../packet'
import { PACommandType } from './common'
import { PATag } from '../tag'
import { ServerInfo } from '../types/pulseaudio'

const serverKeys: string[] = [
  'name',
  'version',
  'user',
  'hostname',
  'sampleSpec',
  'defaultSink',
  'defaultSource',
  'cookie',
  'channelMap'
]

export const serverInfo = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PACommandType.PA_COMMAND_GET_SERVER_INFO)
  packet.setRequestId(requestId)
  return packet
}

export const serverInfoReply = (packet: PAPacket): ServerInfo => {
  return PATag.toObject(packet.tags, serverKeys)[0]
}