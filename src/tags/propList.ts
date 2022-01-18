import { PATag, PATagType } from './common'
import PAProp from './prop'

const PA_PROP_LIST_BASE_SIZE = 2
// PulseAudio proplist tag structure by section
// - 1 byte: tag type
// - X bytes: [props]
// - 1 byte: list terminator
export default class PAPropList extends PATag<Array<[string, string]>> {
  type: PATagType = PATagType.PA_TAG_PROPLIST

  toTagBuffer (value: Array<[string, string]>): Buffer {
    const props: PAProp[] = []
    value.map(val => props.push(new PAProp(val)))

    const parts: Buffer[] = [Buffer.from(PATagType.PA_TAG_PROPLIST), ...props.map(p => p.tag), Buffer.from(PATagType.PA_TAG_STRING_NULL)]
    return Buffer.concat(parts)
  }

  fromTagBuffer (buffer: Buffer): Array<[string, string]> {
    // TODO: Validate buffer
    const values: PAProp[] = this.parseTag(buffer)
    return values.map(v => v.value)
  }

  sanitizeBuffer (buffer: Buffer): Buffer {
    const values: PAProp[] = this.parseTag(buffer)
    let propsSize: number = 0
    for (const val of values) {
      propsSize += val.size
    }
    return buffer.subarray(0, PA_PROP_LIST_BASE_SIZE + propsSize)
  }

  isValidBuffer (buffer: Buffer): boolean {
    const tagType: PATagType = buffer.readUInt8(0)
    return tagType === PATagType.PA_TAG_PROPLIST.toString().charCodeAt(0)
  }

  parseTag (buffer: Buffer): PAProp[] {
    // Check if proplist is empty
    if (buffer.subarray(0, 2).toString('hex') === '504e') {
      return []
    }

    // Parse props until we get to '4e'
    const props: PAProp[] = []
    let done: boolean = false
    let index: number = 1

    while (!done) {
      const prop = new PAProp(buffer.subarray(index))
      props.push(prop)
      index = index + prop.size
      done = buffer.readUInt8(index) === 0x4e
    }

    return props
  }

  /* @ts-expect-error */
  isTagBuffer (buffer: Buffer): boolean {
    return true
  }
}
