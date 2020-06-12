import { PATag, PATagType } from './base'
import PAArbitrary from './arbitrary'
import PAU32 from './u32'
import PAString from './string'

// PulseAudio property tag structure by section
// - 1 byte: tag type
// + X byte: String tag with property name
// + 5 byte: U32 tag with property value length (+1)
// + X byte: Arbitrary tag with null terminated property value (+1)
// - 1 byte: tag string null
export default class PAProp extends PATag<[string, string]> {

  type: PATagType = PATagType.PA_TAG_PROP

  toTagBuffer(value: [string, string]): Buffer {

    const valueBuffer: Buffer = Buffer.allocUnsafe(value[1].length + 1)
    valueBuffer.write(value[1])
    valueBuffer.writeUInt8(0, valueBuffer.length - 1) // Null terminated

    const propName: PAString = new PAString(value[0])
    const propValueLength: PAU32 = new PAU32(valueBuffer.length)
    const propValue: PAArbitrary = new PAArbitrary(valueBuffer)

    const buffer: Buffer = Buffer.allocUnsafe(propName.size + propValueLength.size + propValue.size)
    let offset: number = 0
    offset += propName.tag.copy(buffer, offset)
    offset += propValueLength.tag.copy(buffer, offset)
    offset += propValue.tag.copy(buffer, offset)
    return buffer
  }

  fromTagBuffer(buffer: Buffer): [string, string] {
    // TODO: Validate buffer
    let offset: number = 0

    // Loop until we find '004c' which is the string terminator + u32 tag
    // Once we find it, offset + 1 is where U32 tag starts
    while (buffer.readUInt16BE(offset) !== PATagType.PA_TAG_U32.toString().charCodeAt(0)) {
      offset += 1
    }

    const propName: PAString = new PAString(buffer.subarray(0, offset + 1))
    const propValue: PAArbitrary = new PAArbitrary(buffer.subarray(offset + 1 + 5))

    return [propName.value, propValue.value.subarray(0, propValue.value.length - 1).toString('utf8')]
  }

  /* @ts-ignore */
  isTagBuffer(buffer: Buffer): boolean {
    return true
  }
}
