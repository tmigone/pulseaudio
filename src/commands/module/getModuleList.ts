import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Module } from '../../types/pulseaudio'
import { parseModulePacket } from '.'

interface GetModuleList extends PACommand<Module[]> {
  query: (requestId: number) => PAPacket
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1200
const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_MODULE_INFO_LIST)
  packet.setRequestId(requestId)
  return packet
}

const reply = (packet: PAPacket, protocol: number): Module[] => {
  return parseModulePacket(packet, protocol)
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const GetModuleList: GetModuleList = {
  query,
  reply
}

export default GetModuleList
