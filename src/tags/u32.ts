import { PATag, PATagType } from './common'

const PA_U32_SIZE = 5

// PulseAudio u32 tag structure by section
// - 1 byte: tag type
// - 4 bytes: value
export default class PAU32 extends PATag<number> {
  type: PATagType = PATagType.PA_TAG_U32

  toTagBuffer(value: number): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_U32_SIZE)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_U32.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt32BE(value, offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): number {
    return buffer.readUInt32BE(1)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    return buffer.subarray(0, PA_U32_SIZE)
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === this.type.toString().charCodeAt(0)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
