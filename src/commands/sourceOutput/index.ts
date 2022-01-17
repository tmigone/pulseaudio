import PAPacket from '../../packet'
import { SourceOutput } from '../../types/pulseaudio'

import GetSourceOutput from './getSourceOutput'
import GetSourceOutputList from './getSourceOutputList'
import MoveSourceOutput from './moveSourceOutput'

export {
  GetSourceOutput,
  GetSourceOutputList,
  MoveSourceOutput
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1311
export const parseSourceOutputPacket = (packet: PAPacket): SourceOutput[] => {
  const sourceOutputs: SourceOutput[] = []
  const tags = packet.getTagsIterable()

  while (!tags.done) {
    const sourceOutput: SourceOutput = {
      index: tags.nextValue(),
      name: tags.nextValue(),
      moduleIndex: tags.nextValue(),
      clientIndex: tags.nextValue(),
      sourceIndex: tags.nextValue(),
      sampleSpec: tags.nextValue(),
      channelMap: tags.nextValue(),
      bufferLatency: tags.nextValue(),
      sourceLatency: tags.nextValue(),
      resampleMethod: tags.nextValue(),
      driverName: tags.nextValue(),
      properties: tags.nextValue(),
      isCorked: tags.nextValue(),
      channelVolume: tags.nextValue(),
      isMuted: tags.nextValue(),
      hasVolume: tags.nextValue(),
      isVolumeWritable: tags.nextValue(),
      format: tags.nextValue()
    }

    sourceOutputs.push(sourceOutput)
  }

  return sourceOutputs
}