import { Socket } from 'net'
import PAPacket from './packet'

const socket = new Socket()
// const socketPath = 'pulseaudio:4317'
socket.connect(4317, '192.168.90.207')
socket.on('readable', () => {
  console.log('readable')
  console.log(socket.readableLength)
  let a = socket.read()
  let packet: PAPacket = new PAPacket(a)
  console.log(packet);


})
socket.on('error', (err) => { console.log(err) })
socket.on('connect', () => {
  console.log('connected!')

  // Auth packet
  let packet: PAPacket = new PAPacket()
  packet.put_command(8)
  packet.put_request(0)
  packet.putu32(32)
  packet.put_arbitrary(Buffer.from('780000010059cf1c70a28fa55cc512a36d204963e8ce8b1ccfec5ef095d9b86f1f46f88aea9cb7ea18aa7d163174353379a277ea83867f5e36560749b235f025b48da7dadc7033921b820af1c4434f3dfc196a89f8bdd7357e40dcd741ddeccbc9c5c70cf966e863fef08746912ef2550b0068f4f343f5f97a0bcedae38d66b6483f13dd6af6051ad7b44cae1322e2f1cb2ea4d4ce280cd1775327b36fadf5c5a191758a1dcb02627ddb87e376ef02603c61639b323547359dace2d7a1b1471a0599baa37a2184c0f1a849a4fbccb943a80fb7dbe4619c9e1437bc0fac2811aed25a6305ebc2a23afbc04a4e206445cb20ce8cb2d6045fc158f11533ab0c20a0cfc6c93074', 'hex'))
  let a = packet.writePacket()
  socket.write(a)
  console.log(packet.tags[1].value.toString('hex'));

  // console.log(a.toString('hex'));

})

