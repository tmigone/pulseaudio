import { PATag, PATagType } from './tags/common'
import PAU32 from './tags/u32'
import PAArbitrary from './tags/arbitrary'
import PABoolean from './tags/boolean'
import PAString from './tags/string'
import PAProp from './tags/prop'
import PAPropList from './tags/propList'
import PASampleSpec from './tags/sampleSpec'
import PAChannelMap from './tags/channelMap'
import PAChannelVolume from './tags/channelVolume'
import PAUsec from './tags/usec'
import PAVolume from './tags/volume'
import PAFormat from './tags/format'

export { PATag, PATagType }

// Tag type implementations
export {
  PAArbitrary,
  PABoolean,
  PAU32,
  PAString,
  PAProp,
  PAPropList,
  PASampleSpec,
  PAChannelMap,
  PAChannelVolume,
  PAUsec,
  PAVolume,
  PAFormat
}