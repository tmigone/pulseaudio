import { parseIndexPacket } from '.'
import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Index } from '../../types/pulseaudio'

interface LoadModule extends PACommand<Index> {
  query (requestId: number, name: string, argument: string): PAPacket
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1896
const query = (requestId: number, name: string, argument: string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_LOAD_MODULE)
  packet.setRequestId(requestId)
  packet.putString(name)
  packet.putString(argument)
  return packet
}

const reply = (packet: PAPacket, protocol: number): Index => {
  return parseIndexPacket(packet, protocol)
}

const LoadModule: LoadModule = {
  query,
  reply
}

export default LoadModule