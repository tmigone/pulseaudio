import { PATag, PATagType } from './common'
import { ChannelVolume } from '../types/pulseaudio'

const PA_CHANNEL_VOLUME_BASE_SIZE = 2

// PulseAudio channel volume tag structure by section
// - 1 byte: tag type
// - 1 byte: channel count
// - x bytes: [channel volume]
export default class PAChannelVolume extends PATag<ChannelVolume> {
  type: PATagType = PATagType.PA_TAG_CVOLUME

  toTagBuffer (value: ChannelVolume): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_CHANNEL_VOLUME_BASE_SIZE + value.channels * 4)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_CVOLUME.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt8(value.channels, offset)
    value.volumes.map(volume => buffer.writeUInt32BE(volume, offset))
    return buffer
  }

  fromTagBuffer (buffer: Buffer): ChannelVolume {
    return this.parseTag(buffer)
  }

  sanitizeBuffer (buffer: Buffer): Buffer {
    const value: ChannelVolume = this.parseTag(buffer)
    return buffer.subarray(0, PA_CHANNEL_VOLUME_BASE_SIZE + value.channels * 4)
  }

  parseTag (buffer: Buffer): ChannelVolume {
    const channels: number = buffer.readUInt8(1)
    const volumes: number[] = []
    for (let index = 0; index < channels; index++) {
      volumes.push(buffer.readUInt32BE(2 + index * 4))
    }
    return { channels, volumes }
  }

  isValidBuffer (buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_CVOLUME.toString().charCodeAt(0)
  }

  /* @ts-expect-error */
  isTagBuffer (buffer: Buffer): boolean {
    return true
  }
}
