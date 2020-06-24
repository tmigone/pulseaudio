// See https://github.com/pulseaudio/pulseaudio/blob/v13.0/vala/libpulse.vapi#L924
// See https://fossies.org/dox/pulseaudio-13.0/def_8h.html#ad4e7f11f879e8c77ae5289145ecf6947
export const enum PASubscriptionMask {
  NULL,
  SINK,
  SOURCE,
  SINK_INPUT = 0x0004,
  SOURCE_OUTPUT = 0x0008,
  MODULE = 0x0010,
  CLIENT = 0x0020,
  SAMPLE_CACHE = 0x0040,
  SERVER = 0x0080,
  AUTOLOAD = 0x0100,
  CARD = 0x0200,
  ALL = 0x02FF
}

// See https://github.com/pulseaudio/pulseaudio/blob/v13.0/vala/libpulse.vapi#L942
// See https://fossies.org/dox/pulseaudio-13.0/def_8h.html#a6bedfa147a9565383f1f44642cfef6a3
export const enum PASubscriptionEventType {
  SINK,
  SOURCE,
  SINK_INPUT,
  SOURCE_OUTPUT,
  MODULE,
  CLIENT,
  SAMPLE_CACHE,
  SERVER,
  AUTOLOAD,
  CARD,
  FACILITY_MASK = 0x000F,
  NEW = 0x0000,
  CHANGE = 0x0010,
  REMOVE = 0x0020,
  TYPE_MASK = 0x0030
}

export interface PAEvent {
  category: string,
  type: string,
  index: number,
}