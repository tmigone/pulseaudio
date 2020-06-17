import { PATag, PATagType } from './common'

const PA_BOOLEAN_SIZE = 1

// PulseAudio boolean tag structure by section
// - 1 byte: tag type
export default class PABoolean extends PATag<boolean> {
  type: PATagType = PATagType.PA_TAG_BOOLEAN

  toTagBuffer(value: boolean): Buffer {
    const boolValue: PATagType = value ? PATagType.PA_TAG_BOOLEAN_TRUE : PATagType.PA_TAG_BOOLEAN_FALSE
    const buffer: Buffer = Buffer.allocUnsafe(PA_BOOLEAN_SIZE)
    buffer.writeUInt8(boolValue.toString().charCodeAt(0))
    return buffer
  }

  fromTagBuffer(buffer: Buffer): boolean {
    return buffer.readUInt8(0) === PATagType.PA_TAG_BOOLEAN_TRUE.toString().charCodeAt(0)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    return buffer.subarray(0, PA_BOOLEAN_SIZE)
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return [PATagType.PA_TAG_BOOLEAN, PATagType.PA_TAG_BOOLEAN_TRUE, PATagType.PA_TAG_BOOLEAN_FALSE].map(e => e.toString().charCodeAt(0)).includes(tagType)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}