import { PATag, PATagType } from './common'
import { PAPropList } from '../tag'

type Format = {
  encoding: number,
  properties: [string, string][]
}
// PulseAudio format tag structure by section
// - 1 byte: u8 tag type
// - 1 byte: format count
// -------------------------
// - 1 byte: format info tag type
// - 1 byte: u8 tag type
// - 1 byte: format encoding
// - x bytes: [props]
export default class PAFormat extends PATag<Format[]> {
  type: PATagType = PATagType.PA_TAG_U8

  toTagBuffer(values: Format[]): Buffer {
    const parts: Buffer[] = []

    // u8 tag
    parts.push(Buffer.from(PATagType.PA_TAG_U8))

    // format count
    const formatCount: Buffer = Buffer.allocUnsafe(1)
    formatCount.writeUInt8(values.length)
    parts.push(formatCount)

    // formats...
    for (const value of values) {
      // tags and encoding
      const buffer: Buffer = Buffer.allocUnsafe(3)
      let offset: number = 0
      offset = buffer.writeUInt8(PATagType.PA_TAG_FORMAT_INFO.toString().charCodeAt(0), offset)
      offset = buffer.writeUInt8(PATagType.PA_TAG_U8.toString().charCodeAt(0), offset)
      offset = buffer.writeUInt8(value.encoding, offset)
      parts.push(buffer)

      // Properties
      const props: PAPropList = new PAPropList(value.properties)
      parts.push(props.tag)
    }
    
    return Buffer.concat(parts)
  }

  fromTagBuffer(buffer: Buffer): Format[] {
    return this.parseTag(buffer)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    const formats: Format[] = this.parseTag(buffer)
    const formatSize: number = formats.reduce((sum, format) => {
      const props: PAPropList = new PAPropList(format.properties)
      return sum = sum + 3 + props.size
    }, 2)
    return buffer.subarray(0, formatSize)
  }

  parseTag(buffer: Buffer): Format[] {
    const formats: Format[] = []
    const count: number = buffer.readUInt8(1)
    let offset: number = 2
    for (let index = 0; index < count; index++) {
      const encoding: number = buffer.readUInt8(offset + 2)
      const props: PAPropList = new PAPropList(buffer.subarray(offset + 3))
      formats.push({ encoding, properties: props.value })
      offset = offset + 3 + props.size
    }
    return formats
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_U8.toString().charCodeAt(0)
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
