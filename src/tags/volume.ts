import { PATag, PATagType } from './common'

const PA_VOLUME_SIZE = 5

// PulseAudio volume tag structure by section
// - 1 byte: tag type
// - 4 bytes: volume value
export default class PAVolume extends PATag<number> {
  type: PATagType = PATagType.PA_TAG_VOLUME

  toTagBuffer (value: number): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_VOLUME_SIZE)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_VOLUME.toString().charCodeAt(0), offset)
    buffer.writeUInt32BE(value, offset)
    return buffer
  }

  fromTagBuffer (buffer: Buffer): number {
    return buffer.readUInt32BE(1)
  }

  sanitizeBuffer (buffer: Buffer): Buffer {
    return buffer.subarray(0, PA_VOLUME_SIZE)
  }

  isValidBuffer (buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_VOLUME.toString().charCodeAt(0)
  }

  /* @ts-expect-error */
  isTagBuffer (buffer: Buffer): boolean {
    return true
  }
}
