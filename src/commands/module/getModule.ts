import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Module } from '../../types/pulseaudio'
import { parseModulePacket } from '.'

interface GetModule extends PACommand<Module> {
  query: (requestId: number, module: number | string) => PAPacket
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1177
const query = (requestId: number, moduleIndex: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_MODULE_INFO)
  packet.setRequestId(requestId)
  packet.putU32(moduleIndex)
  return packet
}

const reply = (packet: PAPacket, protocol: number): Module => {
  const sinks = parseModulePacket(packet, protocol)
  if (sinks.length !== 1) {
    throw new Error('Expected exactly one sink!')
  }
  return sinks[0]
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
const GetModule: GetModule = {
  query,
  reply
}

export default GetModule
