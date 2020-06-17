import { PATag, PATagType } from './common'

const PA_CHANNEL_MAP_BASE_SIZE = 2

export type ChannelMap = {
  channels: number,
  types: number[]
}

// PulseAudio channel map tag structure by section
// - 1 byte: tag type
// - 1 byte: channel count
// - x bytes: [channel type]
export default class PAChannelMap extends PATag<ChannelMap> {
  type: PATagType = PATagType.PA_TAG_CHANNEL_MAP

  toTagBuffer(value: ChannelMap): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_CHANNEL_MAP_BASE_SIZE + value.channels)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_CHANNEL_MAP.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt8(value.channels, offset)
    value.types.map(type => offset = buffer.writeUInt8(type, offset))
    return buffer
  }

  fromTagBuffer(buffer: Buffer): ChannelMap {
    return this.parseTag(buffer)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    const value: ChannelMap = this.parseTag(buffer)
    return buffer.subarray(0, PA_CHANNEL_MAP_BASE_SIZE + value.channels)
  }

  parseTag(buffer: Buffer): ChannelMap {
    const channels: number = buffer.readUInt8(1)
    const types: number[] = []
    for (let index = 0; index < channels; index++) {
      types.push(buffer.readUInt8(2 + index))
    }
    return { channels, types }

  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_CHANNEL_MAP.toString().charCodeAt(0)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
