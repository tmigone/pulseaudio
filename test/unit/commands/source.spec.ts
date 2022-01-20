import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import { GetSource, GetSourceList, SetSourceVolume } from '../../../src/commands/source'
import { PA_PROTOCOL_MINIMUM_VERSION } from '../../../src/protocol'
import PAPacket from '../../../src/packet'
import { JSONParse, JSONStringify } from '../../../src/utils/bigInt'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'source'
]

test.before(async _t => {
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }
})

// GetSource
test('GetSource query', t => {
  const f = fixtures.source.getSource
  const [requestId, sourceIndex] = f.queryParameters
  t.is(GetSource.query(requestId, sourceIndex).write().toString('hex'), f.queryBuffer)
})

test('GetSource query by name', t => {
  const f = fixtures.source.getSource
  const [requestId, sourceName] = f.queryParameters
  t.is(GetSource.query(requestId, sourceName).write().toString('hex'), f.queryBuffer)
})

test('GetSource reply', t => {
  const f = fixtures.source.getSource
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetSource.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// GetSourceList
test('GetSourceList query', t => {
  const f = fixtures.source.getSourceList
  const [requestId] = f.queryParameters
  t.is(GetSourceList.query(requestId).write().toString('hex'), f.queryBuffer)
})

test('GetSourceList reply', t => {
  const f = fixtures.source.getSourceList
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetSourceList.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// SetSourceVolume
test('SetSourceVolume query', t => {
  const f = fixtures.source.setSourceVolume
  const [requestId, sourceIndex, sourceVolume] = f.queryParameters
  t.is(SetSourceVolume.query(requestId, sourceIndex, sourceVolume).write().toString('hex'), f.queryBuffer)
})

test('SetSourceVolume reply', t => {
  const f = fixtures.source.setSourceVolume
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(SetSourceVolume.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})
