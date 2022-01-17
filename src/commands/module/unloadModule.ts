import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Status } from '../../types/pulseaudio'

interface UnloadModule extends PACommand<Status> {
  query (requestId: number, moduleIndex: number): PAPacket
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1919
const query = (requestId: number, moduleIndex: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_UNLOAD_MODULE)
  packet.setRequestId(requestId)
  packet.putU32(moduleIndex)
  return packet
}

const reply = (_packet: PAPacket, _protocol: number): Status => {
  return { success: true }
}

const UnloadModule: UnloadModule = {
  query,
  reply
}

export default UnloadModule