import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { PA_NO_VALUE } from '../../protocol'
import { SinkInput } from '../../types/pulseaudio'
import { parseSinkInputPacket } from '.'

interface GetSinkInput extends PACommand<SinkInput> {
  query (requestId: number, sinkInput: number | string): PAPacket
}

const query = (requestId: number, sinkInput: number | string): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_GET_SINK_INPUT_INFO)
  packet.setRequestId(requestId)
  packet.putU32(typeof sinkInput === 'number' ? sinkInput : PA_NO_VALUE)
  return packet
}

const reply = (packet: PAPacket, _protocol: number): SinkInput => {
  const sinkInputs = parseSinkInputPacket(packet)
  if (sinkInputs.length !== 1) {
    throw new Error("Expected exactly one sinkInput!")
  }
  return sinkInputs[0]
}

const GetSinkInput: GetSinkInput = {
  query,
  reply
}

export default GetSinkInput