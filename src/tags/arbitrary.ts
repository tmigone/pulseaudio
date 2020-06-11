import { PATag, PA_TAG_TYPES } from './tag'

// PulseAudio Arbitrary tag structure by section
// - 1 byte: tag type
// - 4 bytes: value length
// - x bytes: tag value 
export default class PA_Arbitrary extends PATag<Buffer> {
  type: PA_TAG_TYPES = PA_TAG_TYPES.PA_TAG_ARBITRARY

  toTagBuffer(value: Buffer): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(5 + value.length)
    let offset: number = 0
    offset = buffer.writeUInt8(PA_TAG_TYPES.PA_TAG_ARBITRARY.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt32BE(value.length, offset)
    offset += value.copy(buffer, offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): Buffer {
    // TODO: Validate buffer
    return buffer.subarray(5)
  }

  isTagBuffer(buffer: Buffer) {
    try {
      const tagType: PA_TAG_TYPES = buffer.readUInt8(0)
      const valueLength: number = buffer.readUInt32BE(1)
      const value: Buffer = buffer.subarray(5)
      return tagType === PA_TAG_TYPES.PA_TAG_ARBITRARY.toString().charCodeAt(0) && valueLength === value.length
    } catch (error) {
      console.log(error)
      return false
    }
  }
}