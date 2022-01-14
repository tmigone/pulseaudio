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
    title: 'subscribe() command',
    query: PACommand.subscribe(0),
    result: '0000000fffffffff0000000000000000000000004c000000234c000000004c000002ff'
  }
]

for (const c of cases) {
  test(c.title, t => {
    t.is(c.query.write().toString('hex'), c.result)
  })
}