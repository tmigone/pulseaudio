import { PATag, PATagType } from './common'

const PA_STRING_BASE_SIZE = 2
const PA_NULL_STRING_SIZE = 1

// PulseAudio string tag structure by section
// - 1 byte: tag type
// - X bytes: value
// - 1 byte: null terminator
// Except for empty strings:
// - 1 btye: empty string tag
export default class PAString extends PATag<string> {
  type: PATagType = PATagType.PA_TAG_STRING

  toTagBuffer (value: string): Buffer {
    let buffer: Buffer

    if (value.length === 0) {
      buffer = Buffer.allocUnsafe(1)
      buffer.writeUInt8(PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0))
    } else {
      buffer = Buffer.allocUnsafe(PA_STRING_BASE_SIZE + value.length)
      let offset: number = 0
      offset = buffer.writeUInt8(PATagType.PA_TAG_STRING.toString().charCodeAt(0), offset)
      offset += buffer.write(value, offset)
      buffer.writeUInt8(0x00, offset) // Null terminator
    }
    return buffer
  }

  fromTagBuffer (buffer: Buffer): string {
    const tagType: PATagType = buffer.readUInt8(0)

    if (tagType === PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0)) {
      return ''
    } else {
      return buffer.toString('utf8', 1, buffer.length - 1) // Remove null terminator
    }
  }

  sanitizeBuffer (buffer: Buffer): Buffer {
    const tagType: PATagType = buffer.readUInt8(0)

    if (tagType === PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0)) {
      return buffer.subarray(0, PA_NULL_STRING_SIZE)
    } else {
      let offset: number = 0
      // Loop until we find the null terminator
      // Once we find it, offset + 1 is where the tag ends
      while (buffer.readUInt8(offset) !== 0x00) {
        offset += 1
      }
      return buffer.subarray(0, offset + 1)
    }
  }

  isValidBuffer (buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return (tagType === PATagType.PA_TAG_STRING.toString().charCodeAt(0)) || (tagType === PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0))
  }

  /* @ts-expect-error */
  isTagBuffer (buffer: Buffer): boolean {
    return true
  }
}
