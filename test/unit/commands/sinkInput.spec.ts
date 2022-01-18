import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import { PA_PROTOCOL_MINIMUM_VERSION } from '../../../src/protocol'
import PAPacket from '../../../src/packet'
import { JSONParse, JSONStringify } from '../../../src/utils/bigInt'
import { GetSinkInput, GetSinkInputList, MoveSinkInput } from '../../../src/commands/sinkInput'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'sinkInput'
]

test.before(async _t => {
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }
})

// GetSinkInput
test("GetSinkInput query", t => {
  const f = fixtures.sinkInput.getSinkInput
  const [ requestId, sinkIndex ] = f.queryParameters
  t.is(GetSinkInput.query(requestId, sinkIndex).write().toString('hex'), f.queryBuffer)
})

test("GetSinkInput reply", t => {
  const f = fixtures.sinkInput.getSinkInput
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetSinkInput.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// GetSinkInputList
test("GetSinkInputList query", t => {
  const f = fixtures.sinkInput.getSinkInputList
  const [ requestId ] = f.queryParameters
  t.is(GetSinkInputList.query(requestId).write().toString('hex'), f.queryBuffer)
})

test("GetSinkInputList reply", t => {
  const f = fixtures.sinkInput.getSinkInputList
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetSinkInputList.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// MoveSinkInput
test("MoveSinkInput query", t => {
  const f = fixtures.sinkInput.moveSinkInput
  const [ requestId, sinkInputIndex, destSinkIndex ] = f.queryParameters
  t.is(MoveSinkInput.query(requestId, sinkInputIndex, destSinkIndex).write().toString('hex'), f.queryBuffer)
})

test("MoveSinkInput reply", t => {
  const f = fixtures.sinkInput.moveSinkInput
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(MoveSinkInput.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})