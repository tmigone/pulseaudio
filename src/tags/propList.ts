import { PATag, PATagType } from './common'
import PAProp from './prop'

const PA_PROP_LIST_BASE_SIZE = 2
// PulseAudio proplist tag structure by section
// - 1 byte: tag type
// - X bytes: [props]
// - 1 byte: list terminator 
export default class PAPropList extends PATag<[string, string][]> {

  type: PATagType = PATagType.PA_TAG_PROPLIST

  toTagBuffer(value: [string, string][]): Buffer {
    const props: PAProp[] = []
    value.map(val => props.push(new PAProp(val)))

    const parts: Buffer[] = [Buffer.from(PATagType.PA_TAG_PROPLIST), ...props.map(p => p.tag), Buffer.from(PATagType.PA_TAG_STRING_NULL)]
    return Buffer.concat(parts)
  }

  fromTagBuffer(buffer: Buffer): [string, string][] {
    // TODO: Validate buffer
    const values: PAProp[] = this.parseTag(buffer)
    return values.map(v => v.value)
  }

  sanitizeBuffer(buffer: Buffer): Buffer {
    const values: PAProp[] = this.parseTag(buffer)
    let propsSize: number = 0
    for (const val of values) {
      propsSize += val.size
    }
    return buffer.subarray(0, PA_PROP_LIST_BASE_SIZE + propsSize)
  }

  isValidBuffer(buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_PROPLIST.toString().charCodeAt(0)
  }

  parseTag(buffer: Buffer): PAProp[] {
    // Split properties by '0074', null terminator on arbitrary + next string tag.
    // TODO: find a better way of doing this
    const props: PAProp[] = []
    const bufferOnlyProps: Buffer = buffer.subarray(1, buffer.length - 1)
    const parts: string[] = bufferOnlyProps.toString('hex').replace('0074', '00|74').split('|')
    parts.map(p => props.push(new PAProp(Buffer.from(p, 'hex'))))
    return props
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
