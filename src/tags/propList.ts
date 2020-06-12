import { PATag, PATagType } from './base'
import { PAProp } from '../tag'

// PulseAudio proplist tag structure by section
// - 1 byte: tag type
// - X bytes: [props]
// - 1 byte: list terminator 
export default class PAPropList extends PATag<[string, string][]> {

  type: PATagType = PATagType.PA_TAG_PROPLIST

  toTagBuffer(value: [string, string][]): Buffer {
    const props: PAProp[] = []
    for (const val of value) {
      props.push(new PAProp(val))
    }

    const parts: Buffer[] = [Buffer.from(PATagType.PA_TAG_PROPLIST), ...props.map(p => p.tag), Buffer.from(PATagType.PA_TAG_STRING_NULL)]
    return Buffer.concat(parts)
  }

  fromTagBuffer(buffer: Buffer): [string, string][] {
    // TODO: Validate buffer
    const values: [string, string][] = []

    // Split properties by '0074', null terminator on arbitrary + next string tag.
    // TODO: find a better way of doing this
    const bufferOnlyProps: Buffer = buffer.subarray(1, buffer.length - 1)
    const parts: string[] = bufferOnlyProps.toString('hex').replace('0074', '00|74').split('|')

    parts.map(p => values.push(new PAProp(Buffer.from(p, 'hex')).value))

    return values
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
