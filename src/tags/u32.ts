import { PATag, PA_TAG_TYPES } from './tag'

export default class PA_U32 extends PATag<number> {
  type: PA_TAG_TYPES = PA_TAG_TYPES.PA_TAG_U32

  toTagBuffer(value: number): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(5)
    let offset: number = 0
    offset = buffer.writeUInt8(PA_TAG_TYPES.PA_TAG_U32.toString().charCodeAt(0), offset)
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
