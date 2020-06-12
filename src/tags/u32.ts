import { PATag, PATagType } from './tag'

// PulseAudio u32 tag structure by section
// - 1 byte: tag type
// - 4 bytes: value
export default class PAU32 extends PATag<number> {
  type: PATagType = PATagType.PA_TAG_U32

  toTagBuffer(value: number): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(5)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_U32.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt32BE(value, offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): number {
    // TODO: Validate buffer
    return buffer.readUInt32BE(1)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true 
  }
}
