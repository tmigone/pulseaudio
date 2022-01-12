import test from 'ava'
import PACommand from '../src/command'
import PAPacket from '../src/packet'


const COOKIE = '780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074'

interface PACommandTestCase {
  title: string,
  query: PAPacket,
  result: string
}
const cases: PACommandTestCase[] = [
  {
    title: 'authenticate() command',
    query: PACommand.authenticate(0, Buffer.from(COOKIE, 'hex')),
    result: '00000114ffffffff0000000000000000000000004c000000084c000000004c00000023780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074'
  },
  {
    title: 'setClientName() command: default name',
    query: PACommand.setClientName(0),
    result: '00000035ffffffff0000000000000000000000004c000000094c0000000050746170706c69636174696f6e2e6e616d65004c0000000d780000000d70616c69622d636c69656e74004e'
  },
  {
    title: 'setClientName() command: custom name',
    query: PACommand.setClientName(0, 'custom-name'),
    result: '00000034ffffffff0000000000000000000000004c000000094c0000000050746170706c69636174696f6e2e6e616d65004c0000000c780000000c637573746f6d2d6e616d65004e'
  },
  {
    title: 'getSinks() command',
    query: PACommand.getSinks(0),
    result: '0000000affffffff0000000000000000000000004c000000164c00000000'
  },
  {
    title: 'subscribe() command',
    query: PACommand.subscribe(0),
    result: '0000000fffffffff0000000000000000000000004c000000234c000000004c000002ff'
  },
  {
    title: 'setSinkVolume() command',
    query: PACommand.setSinkVolume(1, 'alsa_output.default', { channels: 2, volumes: [40000, 40000]}),
    result: '0000002effffffff0000000000000000000000004c000000244c000000014cffffffff74616c73615f6f75747075742e64656661756c7400760200009c4000009c40'
  }
]

for (const c of cases) {
  test(c.title, t => {
    t.is(c.query.write().toString('hex'), c.result)
  })
}