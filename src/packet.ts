// PulseAudio tagstruct
// https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.h
// https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.c

import { 
  PATag,
  PATagType,
  PAU32,
  PAArbitrary
 } from "./tag";

const PA_PACKET_HEADER = Buffer.from([
  0xFF, 0xFF, 0xFF, 0xFF,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
])

// PulseAudio Packet structure by section
// - 4 bytes: Size of the TAGS section in bytes
// - 16 bytes: Packet header
// - 5 bytes: Packet command with u32 tag prefix
// - 5 bytes: Request ID with u32 tag prefix
// - X bytes: TAGS section, multiple [tag + value]
export default class PAPacket {
  // Raw packet buffer
  packet: Buffer

  // Parsed packet sections
  tagsSize: number = 0
  header: Buffer = PA_PACKET_HEADER
  command: PAU32
  request: PAU32
  tags: PATag<any>[] = []

  constructor(packet?: Buffer) {
    if (packet) {
      this.packet = Buffer.from(packet)
      this.readPacket(this.packet)
    }
  }

  // https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.h#L70
  put_command(value: number): void {
    this.command = new PAU32(value)
  }

  put_request(value: number): void {
    this.request = new PAU32(value)
  }

  putu32(value: number): void {
    this.tags.push(new PAU32(value))
  }

  // put_boolean(value: boolean): void {
  //   this.tags.push(new PA_Boolean(value))
  // }

  put_arbitrary(value: Buffer): void {
    this.tags.push(new PAArbitrary(value))
  }

  writePacket(): Buffer {
    // Calculate tagsSize
    const allTags: PATag<any>[] = [this.command, this.request, ...this.tags]
    this.tagsSize = allTags.reduce((sum, tag): number => {
      sum += tag.size
      return sum
    }, 0)

    // Create packet buffer
    this.packet = Buffer.allocUnsafe(4 + PA_PACKET_HEADER.length + this.tagsSize)

    // Sections: tagsSize and header
    let offset: number = 0
    offset = this.packet.writeUInt32BE(this.tagsSize, offset)
    offset += PA_PACKET_HEADER.copy(this.packet, offset)

    // Sections: command, request and tags
    for (const tag of allTags) {
      tag.tag.copy(this.packet, offset)
      offset += tag.size
    }

    return this.packet
  }

  readPacket(buffer: Buffer): void {
    // TODO: assert buffer size/format
    // Sections: tagSize, header, 
    this.tagsSize = buffer.readUInt32BE(0)
    this.header = buffer.subarray(4, 20)
    this.command = new PAU32(buffer.readUInt32BE(21))
    this.request = new PAU32(buffer.readUInt32BE(26))

    // Sections: tags
    const tagsBuffer: Buffer = buffer.subarray(30)

    let offset: number = 0
    while (offset < tagsBuffer.length) {
      const tagType: PATagType = tagsBuffer.readUInt8(offset)
      if (tagType === PATagType.PA_TAG_U32.toString().charCodeAt(0)) {
        const tag: PAU32 = new PAU32(tagsBuffer.subarray(offset, 5))
        this.tags.push(tag)
        offset += tag.size
      }
    }

  }
}