import { PATag, PATagType } from './base'

// PulseAudio string tag structure by section
// - 1 byte: tag type
// - X bytes: value
// - 1 byte: null terminator
// Except for empty strings:
// - 1 btye: empty string tag
export default class PAString extends PATag<string> {
  type: PATagType = PATagType.PA_TAG_STRING

  toTagBuffer(value: string): Buffer {
    let buffer: Buffer

    if (value.length === 0) {
      buffer = Buffer.allocUnsafe(1)
      buffer.writeUInt8(PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0))
    } else {
      buffer = Buffer.allocUnsafe(1 + value.length + 1)
      let offset: number = 0
      offset = buffer.writeUInt8(PATagType.PA_TAG_STRING.toString().charCodeAt(0), offset)
      offset += buffer.write(value, offset)
      offset = buffer.writeUInt8(0, offset) // Null terminator
    }
    return buffer
  }

  fromTagBuffer(buffer: Buffer): string {
    // TODO: Validate buffer
    const tagType: PATagType = buffer.readUInt8(0)

    if (tagType === PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0)) {
      return ''
    } else {
      return buffer.toString('utf8', 1, buffer.length - 1) // Remove null terminator
    }
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
