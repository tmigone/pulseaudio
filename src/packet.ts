// PulseAudio tagstruct
// https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.h
// https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.c

import {
  PATag,
  PATagType,
  PAU32,
  PAArbitrary,
  PABoolean,
  PAString,
  PAProp,
  PAPropList,
  PASampleSpec,
  PAChannelMap,
  PAChannelVolume,
  PAUsec,
  PAVolume,
  PAFormat
} from './tag'
import { ChannelVolume } from './types/pulseaudio'

export const PA_PACKET_HEADER: Buffer = Buffer.from([
  0xFF, 0xFF, 0xFF, 0xFF,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00
])

const enum SectionLength {
  SIZE = 4,
  HEADER = 16,
  COMMAND = 5,
  REQUEST = 5
}
const enum SectionIndex {
  SIZE = 0,
  HEADER = 4,
  HEADER_END = 20,
  COMMAND = 21,
  REQUEST = 26,
  TAGS = 30
}

// PulseAudio Packet structure by section
// - 4 bytes: Size of the TAGS section in bytes (including command and requestId)!
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
  requestId: PAU32
  tags: PATag<any>[] = []

  constructor(buffer?: Buffer) {
    if (buffer) {
      this.packet = Buffer.from(buffer.subarray(0, PAPacket.getPacketSize(buffer)))
      this.read(this.packet)
    }
  }

  write(): Buffer {
    // Calculate tagsSize
    const allTags: PATag<any>[] = [this.command, this.requestId, ...this.tags]
    this.tagsSize = allTags.reduce((sum, tag): number => {
      sum += tag.size
      return sum
    }, 0)

    // Create packet buffer
    this.packet = Buffer.allocUnsafe(SectionLength.SIZE + SectionLength.HEADER + this.tagsSize)

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

  read(buffer: Buffer): void {
    // Sections: tagSize, header,
    if (!PAPacket.isValidPacket(buffer)) {
      throw new Error(`Packet is not valid.`)
    }

    try {
      this.tagsSize = buffer.readUInt32BE(SectionIndex.SIZE)
      this.header = buffer.subarray(SectionIndex.HEADER, SectionIndex.HEADER_END)
      this.command = new PAU32(buffer.readUInt32BE(SectionIndex.COMMAND))
      this.requestId = new PAU32(buffer.readUInt32BE(SectionIndex.REQUEST))

      // Sections: tags
      const tagsBuffer: Buffer = buffer.subarray(SectionIndex.TAGS, SectionIndex.TAGS + this.tagsSize - SectionLength.COMMAND - SectionLength.REQUEST)

      let offset: number = 0
      let tag: PATag<any>
      while (offset < tagsBuffer.length) {
        const tagType: PATagType = tagsBuffer.readUInt8(offset)
        switch (tagType) {
          case PATagType.PA_TAG_U32.toString().charCodeAt(0):
            tag = new PAU32(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_ARBITRARY.toString().charCodeAt(0):
            tag = new PAArbitrary(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_STRING.toString().charCodeAt(0):
          case PATagType.PA_TAG_STRING_NULL.toString().charCodeAt(0):
            tag = new PAString(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_BOOLEAN.toString().charCodeAt(0):
          case PATagType.PA_TAG_BOOLEAN_FALSE.toString().charCodeAt(0):
          case PATagType.PA_TAG_BOOLEAN_TRUE.toString().charCodeAt(0):
            tag = new PABoolean(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_PROPLIST.toString().charCodeAt(0):
            tag = new PAPropList(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_SAMPLE_SPEC.toString().charCodeAt(0):
            tag = new PASampleSpec(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_CHANNEL_MAP.toString().charCodeAt(0):
            tag = new PAChannelMap(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_CVOLUME.toString().charCodeAt(0):
            tag = new PAChannelVolume(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_USEC.toString().charCodeAt(0):
            tag = new PAUsec(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_VOLUME.toString().charCodeAt(0):
            tag = new PAVolume(tagsBuffer.subarray(offset))
            break;
          case PATagType.PA_TAG_FORMAT_INFO.toString().charCodeAt(0):
            tag = new PAFormat(tagsBuffer.subarray(offset))
            break;
          default:
            throw new Error(`Tag type: ${tagType} not supported. Please report issue.`)
        }
        this.tags.push(tag)
        offset += tag.size
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Test wether a chunk is valid as a PA Packet start
  // Returns true even if the chunk is incomplete (chunk size < SectionLength.SIZE + SectionLength.HEADER + dataLength)
  static isChunkHeader(chunk: Buffer): boolean {
    if (chunk.length < SectionLength.SIZE + SectionLength.HEADER) {
      return false
    }

    const header: Buffer = chunk.subarray(SectionIndex.HEADER, SectionIndex.HEADER_END)
    return Buffer.compare(header, PA_PACKET_HEADER) === 0
  }

  // Returns the size of split shunks in bytes
  static getChunksSize(chunks: Buffer[]) {
    return chunks.reduce((sum, chunk) => { return sum += chunk.length }, 0)
  }

  // Get size of the packet in bytes
  static getPacketSize(buffer: Buffer) {
    let tagsSize = buffer.readUInt32BE(SectionIndex.SIZE)
    return SectionLength.SIZE + SectionLength.HEADER + tagsSize
  }

  // Test wether a series of chunks can construct a valid PA Packet
  // Min requirements are starting with a chunk header and having enough bytes to complete the packet
  static isValidPacket(chunks: Buffer | Buffer[]): boolean {
    if (chunks instanceof Buffer) {
      chunks = [chunks]
    }
    if (chunks.length === 0) {
      return false
    }
    let chunksSize: number = this.getChunksSize(chunks)
    let dataLength: number = chunks[0].readUInt32BE(0)

    return this.isChunkHeader(chunks[0]) && chunksSize >= (SectionLength.SIZE + SectionLength.HEADER + dataLength)
  }

  setCommand(value: number): void {
    this.command = new PAU32(value)
  }

  setRequestId(value: number): void {
    this.requestId = new PAU32(value)
  }

  // Put methods
  // https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.h#L70
  putU32(value: number): void {
    this.tags.push(new PAU32(value))
  }

  putBoolean(value: boolean): void {
    this.tags.push(new PABoolean(value))
  }

  putArbitrary(value: Buffer): void {
    this.tags.push(new PAArbitrary(value))
  }

  putString(value: string): void {
    this.tags.push(new PAString(value))
  }

  putProp(value: [string, string]): void {
    this.tags.push(new PAProp(value))
  }

  putPropList(value: [string, string][]): void {
    this.tags.push(new PAPropList(value))
  }

  putChannelVolume(value: ChannelVolume): void {
    this.tags.push(new PAChannelVolume(value))
  }
}