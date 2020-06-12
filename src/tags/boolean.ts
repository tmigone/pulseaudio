import { PATag, PATagType } from './base'

// PulseAudio boolean tag structure by section
// - 1 byte: tag type
export default class PABoolean extends PATag<boolean> {
  type: PATagType = PATagType.PA_TAG_BOOLEAN

  toTagBuffer(value: boolean): Buffer {
    const boolValue: PATagType = value ? PATagType.PA_TAG_BOOLEAN_TRUE : PATagType.PA_TAG_BOOLEAN_FALSE
    const buffer: Buffer = Buffer.allocUnsafe(1)
    let offset: number = 0
    offset = buffer.writeUInt8(boolValue.toString().charCodeAt(0), offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): boolean {
    // TODO: Validate buffer
    return buffer.readUInt8(0) === PATagType.PA_TAG_BOOLEAN_TRUE.toString().charCodeAt(0)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true 
  }
}