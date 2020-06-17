import { PATag, PATagType } from './common'

const PA_USEC_SIZE = 9

// PulseAudio usec tag structure by section
// - 1 byte: tag type
// - 8 bytes: value
export default class PAUsec extends PATag<bigint> {
  type: PATagType = PATagType.PA_TAG_USEC

  toTagBuffer(value: bigint): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_USEC_SIZE)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_USEC.toString().charCodeAt(0), offset)
    offset = buffer.writeBigUInt64BE(value, offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): bigint {
    return buffer.readBigUInt64BE(1)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    return buffer.subarray(0, PA_USEC_SIZE)
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_USEC.toString().charCodeAt(0)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
