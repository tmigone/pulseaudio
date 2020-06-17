import test from 'ava'
import { PATag, PATagType, PAU32, PABoolean, PAString, PAArbitrary, PAProp, PAPropList, PAChannelMap, PASampleSpec, PAChannelVolume, PAUsec, PAVolume, PAFormat } from '../src/tag'

interface PATagTestCases<T> {
  title: string
  pa_tag: PATag<T>
  expected: {
    tag: Buffer
    size: number
    type: PATagType
    value: T
  }
}

// TODO: 
// Refactor this mess
// Add tests with buffers bigger/smaller than expected
const cases: PATagTestCases<any>[] = [
  {
    title: 'Create u32 from value',
    pa_tag: new PAU32(120),
    expected: {
      tag: Buffer.from('4c00000078', 'hex'),
      size: 5,
      type: PATagType.PA_TAG_U32,
      value: 120
    }
  },
  {
    title: 'Create u32 from buffer',
    pa_tag: new PAU32(Buffer.from('4c00000078', 'hex')),
    expected: {
      tag: Buffer.from('4c00000078', 'hex'),
      size: 5,
      type: PATagType.PA_TAG_U32,
      value: 120
    }
  },
  {
    title: 'Create arbitrary from value',
    pa_tag: new PAArbitrary(Buffer.from('59cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex')),
    expected: {
      tag: Buffer.from('780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex'),
      size: 261,
      type: PATagType.PA_TAG_ARBITRARY,
      value: Buffer.from('59cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex')
    }
  },
  {
    title: 'Create arbitrary from buffer',
    pa_tag: new PAArbitrary(Buffer.from('780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex')),
    expected: {
      tag: Buffer.from('780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex'),
      size: 261,
      type: PATagType.PA_TAG_ARBITRARY,
      value: Buffer.from('59cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex')
    }
  },
  {
    title: 'Create boolean from value',
    pa_tag: new PABoolean(false),
    expected: {
      tag: Buffer.from('30', 'hex'),
      size: 1,
      type: PATagType.PA_TAG_BOOLEAN,
      value: false
    }
  },
  {
    title: 'Create boolean from buffer',
    pa_tag: new PABoolean(Buffer.from('30', 'hex')),
    expected: {
      tag: Buffer.from('30', 'hex'),
      size: 1,
      type: PATagType.PA_TAG_BOOLEAN,
      value: false
    }
  },
  {
    title: 'Create string from value',
    pa_tag: new PAString('hola.que-tal'),
    expected: {
      tag: Buffer.from('74686f6c612e7175652d74616c00', 'hex'),
      size: 14,
      type: PATagType.PA_TAG_STRING,
      value: 'hola.que-tal'
    }
  },
  {
    title: 'Create string from buffer',
    pa_tag: new PAString(Buffer.from('74686f6c612e7175652d74616c00', 'hex')),
    expected: {
      tag: Buffer.from('74686f6c612e7175652d74616c00', 'hex'),
      size: 14,
      type: PATagType.PA_TAG_STRING,
      value: 'hola.que-tal'
    }
  },
  {
    title: 'Create empty string from value',
    pa_tag: new PAString(''),
    expected: {
      tag: Buffer.from('4e', 'hex'),
      size: 1,
      type: PATagType.PA_TAG_STRING,
      value: ''
    }
  },
  {
    title: 'Create prop from value',
    pa_tag: new PAProp(['application.name', 'pulse-audio-sinks.js']),
    expected: {
      tag: Buffer.from('746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a7300', 'hex'),
      size: 49,
      type: PATagType.PA_TAG_PROP,
      value: ['application.name', 'pulse-audio-sinks.js']
    }
  },
  {
    title: 'Create prop from buffer',
    pa_tag: new PAProp(Buffer.from('746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a7300', 'hex')),
    expected: {
      tag: Buffer.from('746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a7300', 'hex'),
      size: 49,
      type: PATagType.PA_TAG_PROP,
      value: ['application.name', 'pulse-audio-sinks.js']
    }
  },
  {
    title: 'Create list of props from values',
    pa_tag: new PAPropList([['application.name', 'pulse-audio-sinks.js'], ['application.name', 'pulse-audio-sinks.js']]),
    expected: {
      tag: Buffer.from('50746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a7300746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a73004e', 'hex'),
      size: 100,
      type: PATagType.PA_TAG_PROPLIST,
      value: [['application.name', 'pulse-audio-sinks.js'], ['application.name', 'pulse-audio-sinks.js']]
    }
  },
  {
    title: 'Create list of props from buffer',
    pa_tag: new PAPropList(Buffer.from('50746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a7300746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a73004e', 'hex')),
    expected: {
      tag: Buffer.from('50746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a7300746170706c69636174696f6e2e6e616d65004c00000015780000001570756c73652d617564696f2d73696e6b732e6a73004e', 'hex'),
      size: 100,
      type: PATagType.PA_TAG_PROPLIST,
      value: [['application.name', 'pulse-audio-sinks.js'], ['application.name', 'pulse-audio-sinks.js']]
    }
  },
  {
    title: 'Create empty list of props from values',
    pa_tag: new PAPropList([]),
    expected: {
      tag: Buffer.from('504e', 'hex'),
      size: 2,
      type: PATagType.PA_TAG_PROPLIST,
      value: []
    }
  },
  {
    title: 'Create empty list of props from buffer',
    pa_tag: new PAPropList(Buffer.from('504e', 'hex')),
    expected: {
      tag: Buffer.from('504e', 'hex'),
      size: 2,
      type: PATagType.PA_TAG_PROPLIST,
      value: []
    }
  },
  {
    title: 'Create sampleSpec from values',
    pa_tag: new PASampleSpec({ format: 3, channels: 2, rate: 44100 }),
    expected: {
      tag: Buffer.from('6103020000ac44', 'hex'),
      size: 7,
      type: PATagType.PA_TAG_SAMPLE_SPEC,
      value: { format: 3, channels: 2, rate: 44100 }
    }
  },
  {
    title: 'Create sampleSpec from buffer',
    pa_tag: new PASampleSpec(Buffer.from('6103020000ac44', 'hex')),
    expected: {
      tag: Buffer.from('6103020000ac44', 'hex'),
      size: 7,
      type: PATagType.PA_TAG_SAMPLE_SPEC,
      value: { format: 3, channels: 2, rate: 44100 }
    }
  },
  {
    title: 'Create channelMap from values',
    pa_tag: new PAChannelMap({ channels: 2, types: [1, 2] }),
    expected: {
      tag: Buffer.from('6d020102', 'hex'),
      size: 4,
      type: PATagType.PA_TAG_CHANNEL_MAP,
      value: { channels: 2, types: [1, 2] }
    }
  },
  {
    title: 'Create channelMap from buffer',
    pa_tag: new PAChannelMap(Buffer.from('6d020102', 'hex')),
    expected: {
      tag: Buffer.from('6d020102', 'hex'),
      size: 4,
      type: PATagType.PA_TAG_CHANNEL_MAP,
      value: { channels: 2, types: [1, 2] }
    }
  },
  {
    title: 'Create channelVolume from values',
    pa_tag: new PAChannelVolume({ channels: 2, volumes: [65536, 65536] }),
    expected: {
      tag: Buffer.from('76020001000000010000', 'hex'),
      size: 10,
      type: PATagType.PA_TAG_CVOLUME,
      value: { channels: 2, volumes: [65536, 65536] }
    }
  },
  {
    title: 'Create channelVolume from buffer',
    pa_tag: new PAChannelVolume(Buffer.from('76020001000000010000', 'hex')),
    expected: {
      tag: Buffer.from('76020001000000010000', 'hex'),
      size: 10,
      type: PATagType.PA_TAG_CVOLUME,
      value: { channels: 2, volumes: [65536, 65536] }
    }
  },
  {
    title: 'Create usec from values',
    pa_tag: new PAUsec(BigInt("0x1234123456785678")),
    expected: {
      tag: Buffer.from('551234123456785678', 'hex'),
      size: 9,
      type: PATagType.PA_TAG_USEC,
      value: BigInt("0x1234123456785678")
    }
  },
  {
    title: 'Create usec from buffer',
    pa_tag: new PAUsec(Buffer.from('551234123456785678', 'hex')),
    expected: {
      tag: Buffer.from('551234123456785678', 'hex'),
      size: 9,
      type: PATagType.PA_TAG_USEC,
      value: BigInt("0x1234123456785678")
    }
  },
  {
    title: 'Create volume from values',
    pa_tag: new PAVolume(65536),
    expected: {
      tag: Buffer.from('5600010000', 'hex'),
      size: 5,
      type: PATagType.PA_TAG_VOLUME,
      value: 65536
    }
  },
  {
    title: 'Create volume from buffer',
    pa_tag: new PAVolume(Buffer.from('5600010000', 'hex')),
    expected: {
      tag: Buffer.from('5600010000', 'hex'),
      size: 5,
      type: PATagType.PA_TAG_VOLUME,
      value: 65536
    }
  },
  {
    title: 'Create format from values',
    pa_tag: new PAFormat([{ encoding: 1, properties: [] }]),
    expected: {
      tag: Buffer.from('4201664201504e', 'hex'),
      size: 7,
      type: PATagType.PA_TAG_U8,
      value: [{ encoding: 1, properties: [] }]
    }
  },
  {
    title: 'Create format from buffer',
    pa_tag: new PAFormat(Buffer.from('4201664201504e', 'hex')),
    expected: {
      tag: Buffer.from('4201664201504e', 'hex'),
      size: 7,
      type: PATagType.PA_TAG_U8,
      value: [{ encoding: 1, properties: [] }]
    }
  },
]

for (const c of cases) {

  test(`${c.title}: type is correct`, t => {
    t.is(c.pa_tag.type, c.expected.type)
  })

  test(`${c.title}: value is correct`, t => {
    t.deepEqual(c.pa_tag.value, c.expected.value)
  })

  test(`${c.title}: size is correct`, t => {
    t.is(c.pa_tag.tag.length, c.expected.size)
  })

  test(`${c.title}: tag buffer is correct`, t => {
    t.deepEqual(c.pa_tag.tag, c.expected.tag)
  })
}


