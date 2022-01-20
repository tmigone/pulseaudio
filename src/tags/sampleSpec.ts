import { PATag, PATagType } from './common'
import { SampleSpec } from '../types/pulseaudio'

const PA_SAMPLE_SPEC_SIZE = 7

// PulseAudio sampleSpec tag structure by section
// - 1 byte: tag type
// - 1 byte: format
// - 1 byte: channels
// - 4 bytes: rate in Hz
export default class PASampleSpec extends PATag<SampleSpec> {
  type: PATagType = PATagType.PA_TAG_SAMPLE_SPEC

  toTagBuffer (value: SampleSpec): Buffer {
    const buffer: Buffer = Buffer.allocUnsafe(PA_SAMPLE_SPEC_SIZE)
    let offset: number = 0
    offset = buffer.writeUInt8(PATagType.PA_TAG_SAMPLE_SPEC.toString().charCodeAt(0), offset)
    offset = buffer.writeUInt8(value.format, offset)
    offset = buffer.writeUInt8(value.channels, offset)
    buffer.writeUInt32BE(value.rate, offset)
    return buffer
  }

  fromTagBuffer (buffer: Buffer): SampleSpec {
    return {
      format: buffer.readUInt8(1),
      channels: buffer.readUInt8(2),
      rate: buffer.readUInt32BE(3)
    }
  }

  sanitizeBuffer (buffer: Buffer): Buffer {
    return buffer.subarray(0, PA_SAMPLE_SPEC_SIZE)
  }

  isValidBuffer (buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_SAMPLE_SPEC.toString().charCodeAt(0)
  }

  /* @ts-expect-error */
  isTagBuffer (buffer: Buffer): boolean {
    return true
  }
}
