import { parseServerInfoPacket } from '.'
import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { ServerInfo } from '../../types/pulseaudio'

interface GetServerInfo extends PACommand<ServerInfo> {
  query (requestId: number): PAPacket
}

const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SERVER_INFO)
  packet.setRequestId(requestId)
  return packet
}

const reply = (packet: PAPacket, protocol: number): ServerInfo => {
  const serverInfo = parseServerInfoPacket(packet, protocol)
  if (serverInfo.length !== 1) {
    throw new Error("Expected exactly one serverInfo!")
  }
  return serverInfo[0]
}

const GetServerInfo: GetServerInfo = {
  query,
  reply
}

export default GetServerInfo