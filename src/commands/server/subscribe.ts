import { PACommand, PA_NATIVE_COMMAND_NAMES } from '..'
import PAPacket from '../../packet'
import { PASubscriptionMask } from '../../event'
import { SubscribeInfo } from '../../types/pulseaudio'

interface Subscribe extends PACommand<SubscribeInfo> {
  query(requestId: number): PAPacket
}

const query = (requestId: number): PAPacket => {
  const packet: PAPacket = new PAPacket()
  packet.setCommand(PA_NATIVE_COMMAND_NAMES.PA_COMMAND_SUBSCRIBE)
  packet.setRequestId(requestId)
  packet.putU32(PASubscriptionMask.ALL)
  return packet
}

const reply = (_packet: PAPacket, _protocol: number): SubscribeInfo => {
  return {
    success: true
  }
}

const Subscribe: Subscribe = {
  query,
  reply
}

export default Subscribe