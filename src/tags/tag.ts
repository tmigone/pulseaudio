// Valid PulseAudio type tags
// See https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.h#L41
export const enum PA_TAG_TYPES {
  PA_TAG_INVALID = 0,
  PA_TAG_STRING = 't',
  PA_TAG_STRING_NULL = 'N',
  PA_TAG_U32 = 'L',
  PA_TAG_U8 = 'B',
  PA_TAG_U64 = 'R',
  PA_TAG_S64 = 'r',
  PA_TAG_SAMPLE_SPEC = 'a',
  PA_TAG_ARBITRARY = 'x',
  PA_TAG_BOOLEAN_TRUE = '1',
  PA_TAG_BOOLEAN_FALSE = '0',
  PA_TAG_BOOLEAN = PA_TAG_BOOLEAN_TRUE,
  PA_TAG_TIMEVAL = 'T',
  PA_TAG_USEC = 'U'  /* 64bit unsigned */,
  PA_TAG_CHANNEL_MAP = 'm',
  PA_TAG_CVOLUME = 'v',
  PA_TAG_PROPLIST = 'P',
  PA_TAG_VOLUME = 'V',
  PA_TAG_FORMAT_INFO = 'f',
}

// PulseAudio tag structure by section
// - 1 byte: tag type
// - x bytes: tag value 
export abstract class PATag<T> {
  // Raw tag buffer
  tag: Buffer
  size: number

  // Parsed sections
  type: PA_TAG_TYPES
  value: T

  // toBuffer: write a value into a PulseAudio tag buffer
  abstract toTagBuffer(value: T): Buffer

  // fromBuffer: parse a value from a PulseAudio tag buffer
  abstract fromTagBuffer(buffer: Buffer): T

  // isTagBuffer: check if buffer is a tag buffer
  abstract isTagBuffer(buffer: Buffer): boolean

  constructor(init: T | Buffer) {
    if (init instanceof Buffer && this.isTagBuffer(init)) {
      this.tag = Buffer.from(init)
      this.value = this.fromTagBuffer(this.tag)
    }
    else {
      this.value = init as T
      this.tag = Buffer.from(this.toTagBuffer(this.value))
    }

    this.size = this.tag.length
  }

}

// class PA_Boolean implements PATag {
//   constructor(
//     public value: boolean,
//     public type: PA_TAGS = PA_TAGS.PA_TAG_BOOLEAN,
//     public size: number = 0,
//     public buffer: Buffer = null
//   ) {
//     this.size = 1
//     this.buffer = Buffer.allocUnsafe(this.size)
//     this.put()
//   }

//   put(): number {
//     this.type = this.value ? PA_TAGS.PA_TAG_BOOLEAN_TRUE : PA_TAGS.PA_TAG_BOOLEAN_FALSE
//     let offset: number = 0
//     offset = this.buffer.writeUInt8(this.type.toString().charCodeAt(0), offset)
//     return offset
//   }

// }