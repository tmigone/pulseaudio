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
    // Find proplist end
    // Loop until we find '4e' which is the string terminator + next byte is not a known tag type
    // Once we find it, offset + 1 is where prop list ends
    let end: number = 0

    for (let index: number = 0; index < buffer.length; index++) {
      if (buffer.readUInt8(index) === PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0)) {
        if (index === buffer.length - 1 || this.isKnownTagType(buffer.readUInt8(index + 1))) {
          end = index
          break
        }
      }
    }

    // Check if proplist is empty
    if (buffer.subarray(0, 2).toString('hex') === '504e') {
      return []
    }

    // Split properties by '0074', null terminator on arbitrary + next string tag.
    // TODO: find a better way of doing this
    const props: PAProp[] = []
    const bufferOnlyProps: Buffer = buffer.subarray(1, end)
    const parts: string[] = bufferOnlyProps.toString('hex').replace(/0074/g, '00|74').split('|')
    parts.map(p => props.push(new PAProp(Buffer.from(p, 'hex'))))
    return props
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
