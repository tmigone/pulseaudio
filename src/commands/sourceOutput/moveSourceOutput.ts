import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Status } from '../../types/pulseaudio'

interface MoveSourceOutput extends PACommand<Status> {
  query (requestId: number, sourceOutput: number, destSource: number): PAPacket
}

const query = (requestId: number, sourceOutput: number, destSource: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_MOVE_SOURCE_OUTPUT)
  packet.setRequestId(requestId)
  packet.putU32(sourceOutput)
  packet.putU32(destSource)
  packet.putString('')
  return packet
}

const reply = (_packet: PAPacket, _protocol: number): Status => {
  // Looks like the reply has no data?
  return { success: true }
}

const MoveSourceOutput: MoveSourceOutput = {
  query,
  reply
}

export default MoveSourceOutput
