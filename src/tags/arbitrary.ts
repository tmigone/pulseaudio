import { PATag, PATagType } from './common'

const PA_ARBITRARY_BASE_SIZE = 5

// PulseAudio Arbitrary tag structure by section
// - 1 byte: tag type
// - 4 bytes: value length
// - x bytes: tag value 
export default class PAArbitrary extends PATag<Buffer> {
  type: PATagType = PATagType.PA_TAG_ARBITRARY

  toTagBuffer(value: Buffer): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_ARBITRARY_BASE_SIZE + value.length)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_ARBITRARY.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt32BE(value.length, offset)
    offset += value.copy(buffer, offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): Buffer {
    return buffer.subarray(5)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    const valueLength: number = buffer.readUInt32BE(1)
    return buffer.subarray(0, PA_ARBITRARY_BASE_SIZE + valueLength)
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === this.type
  }

  isTagBuffer(buffer: Buffer) {
    try {
      const tagType: PATagType = buffer.readUInt8(0)
      const valueLength: number = buffer.readUInt32BE(1)
      const value: Buffer = buffer.subarray(5)
      return tagType === PATagType.PA_TAG_ARBITRARY.toString().charCodeAt(0) && valueLength === value.length
    } catch (error) {
      console.log(error)
      return false
    }
  }
}