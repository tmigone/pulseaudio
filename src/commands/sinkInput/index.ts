import PAPacket from '../../packet'
import { SinkInput } from '../../types/pulseaudio'

import GetSinkInput from './getSinkInput'
import GetSinkInputList from './getSinkInputList'
import MoveSinkInput from './moveSinkInput'

export {
  GetSinkInput,
  GetSinkInputList,
  MoveSinkInput
}

export const parseSinkInputPacket = (packet: PAPacket): SinkInput[] => {
  const sinkInputs: SinkInput[] = []
  const tags = packet.getTagsIterable()

  while (!tags.done) {
    const sinkInput: SinkInput = {
      index: tags.nextValue(),
      name: tags.nextValue(),
      moduleIndex: tags.nextValue(),
      clientIndex: tags.nextValue(),
      sinkIndex: tags.nextValue(),
      sampleSpec: tags.nextValue(),
      channelMap: tags.nextValue(),
      channelVolume: tags.nextValue(),
      bufferLatency: tags.nextValue(),
      sinkLatency: tags.nextValue(),
      resampleMethod: tags.nextValue(),
      driverName: tags.nextValue(),
      isMuted: tags.nextValue(),
      properties: tags.nextValue(),
      isCorked: tags.nextValue(),
      hasVolume: tags.nextValue(),
      isVolumeWritable: tags.nextValue(),
      format: tags.nextValue()
    }

    sinkInputs.push(sinkInput)
  }

  return sinkInputs
}