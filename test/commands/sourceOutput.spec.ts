import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import { PA_PROTOCOL_MINIMUM_VERSION } from '../../src/protocol'
import PAPacket from '../../src/packet'
import { JSONParse, JSONStringify } from '../../src/utils/bigInt'
import { GetSourceOutput, GetSourceOutputList, MoveSourceOutput } from '../../src/commands/sourceOutput'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'sourceOutput'
]

test.before(async _t => {
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }
})

// GetSourceOutput
test("GetSourceOutput query", t => {
  const f = fixtures.sourceOutput.getSourceOutput
  const [ requestId, sourceIndex ] = f.queryParameters
  t.is(GetSourceOutput.query(requestId, sourceIndex).write().toString('hex'), f.queryBuffer)
})

test("GetSourceOutput reply", t => {
  const f = fixtures.sourceOutput.getSourceOutput
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetSourceOutput.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// GetSourceOutputList
test("GetSourceOutputList query", t => {
  const f = fixtures.sourceOutput.getSourceOutputList
  const [ requestId ] = f.queryParameters
  t.is(GetSourceOutputList.query(requestId).write().toString('hex'), f.queryBuffer)
})

test("GetSourceOutputList reply", t => {
  const f = fixtures.sourceOutput.getSourceOutputList
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetSourceOutputList.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// MoveSourceOutput
test("MoveSourceOutput query", t => {
  const f = fixtures.sourceOutput.moveSourceOutput
  const [ requestId, sourceOutputIndex, destSource ] = f.queryParameters
  t.is(MoveSourceOutput.query(requestId, sourceOutputIndex, destSource).write().toString('hex'), f.queryBuffer)
})

test("MoveSourceOutput reply", t => {
  const f = fixtures.sourceOutput.moveSourceOutput
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(MoveSourceOutput.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})