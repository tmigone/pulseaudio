import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { Status } from '../../types/pulseaudio'

interface MoveSinkInput extends PACommand<Status> {
  query (requestId: number, sinkInput: number, destSink: number): PAPacket
}

const query = (requestId: number, sinkInputIndex: number, destSinkIndex: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_MOVE_SINK_INPUT)
  packet.setRequestId(requestId)
  packet.putU32(sinkInputIndex)
  packet.putU32(destSinkIndex)
  packet.putString('')
  return packet
}

const reply = (_packet: PAPacket, _protocol: number): Status => {
  // Looks like the reply has no data?
  return { success: true }
}

const MoveSinkInput: MoveSinkInput = {
  query,
  reply
}

export default MoveSinkInput
