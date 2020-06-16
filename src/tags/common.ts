// PulseAudio tag types
// See https://github.com/pulseaudio/pulseaudio/blob/master/src/pulsecore/tagstruct.h#L41
export const enum PATagType {
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
  PA_TAG_PROP = 'p' // Custom tag, this is not part of PulseAudio spec
}

// PulseAudio tag structure by section
// - 1 byte: tag type
// - x bytes: tag value 
export abstract class PATag<T> {
  // Raw tag buffer
  tag: Buffer
  size: number

  // Parsed sections
  type: PATagType
  value: T

  // toBuffer: write a value into a PulseAudio tag buffer
  abstract toTagBuffer(value: T): Buffer

  // fromBuffer: parse a value from a PulseAudio tag buffer
  // Asumes that the provided buffer is valid and has the correct size
  abstract fromTagBuffer(buffer: Buffer): T

  // isValidBuffer: tests if a buffer is valid
  abstract isValidBuffer(buffer: Buffer): boolean

  // sanitizeBuffer: returns a sanitized buffer
  // if original size is correct then returns buffer as is
  // if original size is bigger then returns a resized buffer
  abstract sanitizeBuffer(buffer: Buffer): Buffer
  
  // isTagBuffer: check if buffer is a tag buffer
  abstract isTagBuffer(buffer: Buffer): boolean
  
  constructor(init: T | Buffer) {
    if (init instanceof Buffer && this.isTagBuffer(init)) {
      // if (this.isValidBuffer(init)) {
        this.tag = Buffer.from(this.sanitizeBuffer(init))
        this.value = this.fromTagBuffer(this.tag)
      // } else {
        // throw new Error(`Error parsing buffer. Incorrect tag type!`)
      // }
    }
    else {
      this.value = init as T
      this.tag = Buffer.from(this.toTagBuffer(this.value))
    }

    this.size = this.tag.length
  }
}