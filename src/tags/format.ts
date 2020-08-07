import { PATag, PATagType } from './common'
import { PAPropList } from '../tag'
import { Format } from '../types/pulseaudio'

// PulseAudio format tag structure by section
// - 1 byte: format tag type
// - 1 byte: u8 tag type ??? https://github.com/pulseaudio/pulseaudio/blob/4e3a080d7699732be9c522be9a96d851f97fbf11/src/pulsecore/tagstruct.c#L337
// - 1 byte: format encoding
// - x bytes: [props]
export default class PAFormat extends PATag<Format> {
  type: PATagType = PATagType.PA_TAG_FORMAT_INFO

  toTagBuffer(values: Format): Buffer {
    const parts: Buffer[] = []

    parts.push(Buffer.from(PATagType.PA_TAG_FORMAT_INFO))
    parts.push(Buffer.from(PATagType.PA_TAG_U8))

    const buffer: Buffer = Buffer.allocUnsafe(1)
    buffer.writeUInt8(values.encoding)
    parts.push(buffer)
    
    const props: PAPropList = new PAPropList(values.properties)
    parts.push(props.tag)

    return Buffer.concat(parts)
  }

  fromTagBuffer(buffer: Buffer): Format {
    return this.parseTag(buffer)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    const props: PAPropList = new PAPropList(buffer.subarray(3))
    return buffer.subarray(0, props.size + 3)
  }

  parseTag(buffer: Buffer): Format {
    const encoding: number = buffer.readUInt8(2)
    const props: PAPropList = new PAPropList(buffer.subarray(3))
    return {
      encoding,
      properties: props.value
    }
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_FORMAT_INFO.toString().charCodeAt(0)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
