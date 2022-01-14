import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { ClientInfo } from '../../types/pulseaudio'

interface SetClientName extends PACommand<ClientInfo> {
  query(requestId: number, name?: string): PAPacket
}

const query = (requestId: number, clientName: string = 'palib-client'): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SET_CLIENT_NAME)
  packet.setRequestId(requestId)
  packet.putPropList([['application.name', clientName]])
  return packet
}

const reply = (packet: PAPacket): ClientInfo => {
  return {
    index: packet.tags[0].value
  }
}

const SetClientName: SetClientName = {
  query,
  reply
}

export default SetClientName