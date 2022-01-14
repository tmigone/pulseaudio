import test from 'ava'
import { PA_NATIVE_COMMAND_NAMES } from '../src/commands'
import PAPacket, { PA_PACKET_HEADER } from '../src/packet'
import { PA_MAX_REQUEST_ID } from '../src/protocol'
import { PAU32, PAArbitrary } from '../src/tag'

const data = {
  requestId: Math.floor(Math.random() * PA_MAX_REQUEST_ID),
  command: PA_NATIVE_COMMAND_NAMES.PA_COMMAND_AUTH
}

const packet: PAPacket = new PAPacket()
packet.setCommand(data.command)
packet.setRequestId(data.requestId)
packet.putU32(1234)
packet.putArbitrary(Buffer.from('1234567890abcdef', 'hex'))

// Force write call to get class members populated.
// TODO: consider PAPacket auto-updating all class members on every method call?
packet.write()

const packetFromBuffer: PAPacket = new PAPacket(packet.packet)

test(`Build packet from sections: tagSize`, t => {
  const calcSize: number = 5 + 5 + 5 + 5 + 8  // 5 (U32) + 5 (U32) + 5 (U32) + 5+8 (Arb)
  t.is(packet.tagsSize, calcSize)
})

test(`Build packet from sections: command`, t => {
  t.is(packet.command.value, PA_NATIVE_COMMAND_NAMES.PA_COMMAND_AUTH)
})

test(`Build packet from sections: requestId`, t => {
  t.is(packet.requestId.value, data.requestId)
})

test(`Build packet from sections: header`, t => {
  t.deepEqual(packet.header, PA_PACKET_HEADER)
})

test(`Build packet from sections: tags`, t => {
  t.deepEqual(packet.tags, [
    new PAU32(1234),
    new PAArbitrary(Buffer.from('1234567890abcdef', 'hex'))
  ])
})

test(`Build packet from buffer: tagSize`, t => {
  const calcSize: number = 5 + 5 + 5 + 5 + 8  // 5 (U32) + 5 (U32) + 5 (U32) + 5+8 (Arb)
  t.is(packetFromBuffer.tagsSize, calcSize)
})

test(`Build packet from buffer: command`, t => {
  t.is(packetFromBuffer.command.value, PA_NATIVE_COMMAND_NAMES.PA_COMMAND_AUTH)
})

test(`Build packet from buffer: requestId`, t => {
  t.is(packetFromBuffer.requestId.value, data.requestId)
})

test(`Build packet from buffer: header`, t => {
  t.deepEqual(packetFromBuffer.header, PA_PACKET_HEADER)
})

test(`Build packet from buffer: tags`, t => {
  t.deepEqual(packetFromBuffer.tags, [
    new PAU32(1234),
    new PAArbitrary(Buffer.from('1234567890abcdef', 'hex'))
  ])
})

test(`Build packet from buffer that is longer than packet`, t => {
  const packetWithExtraStuff: PAPacket = new PAPacket(Buffer.from('00000014ffffffff0000000000000000000000004c000000424cffffffff4c000000104c0000000100000014ffffffff0000000000000000000000004c000000424cffffffff4c000000114c00000001', 'hex'))
  t.deepEqual(packetWithExtraStuff.tags, [
    new PAU32(Buffer.from('4c00000010', 'hex')),
    new PAU32(Buffer.from('4c00000001', 'hex'))
  ])
})




