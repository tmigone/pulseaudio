import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import { GetModule, GetModuleList, LoadModule } from '../../../src/commands/module'
import { PA_PROTOCOL_MINIMUM_VERSION } from '../../../src/protocol'
import PAPacket from '../../../src/packet'
import { JSONParse, JSONStringify } from '../../../src/utils/bigInt'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'module'
]

test.before(async _t => {
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }
})

// GetModule
test("GetModule query", t => {
  const f = fixtures.module.getModule
  const [ requestId, moduleIndex ] = f.queryParameters
  t.is(GetModule.query(requestId, moduleIndex).write().toString('hex'), f.queryBuffer)
})

test("GetModule reply", t => {
  const f = fixtures.module.getModule
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetModule.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// GetModuleList
test("GetModuleList query", t => {
  const f = fixtures.module.getModuleList
  const [ requestId ] = f.queryParameters
  t.is(GetModuleList.query(requestId).write().toString('hex'), f.queryBuffer)
})

test("GetModuleList reply", t => {
  const f = fixtures.module.getModuleList
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetModuleList.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// LoadModule
test("LoadModule query", t => {
  const f = fixtures.module.loadModule
  const [ requestId, name, argument ] = f.queryParameters
  t.is(LoadModule.query(requestId, name, argument).write().toString('hex'), f.queryBuffer)
})

test("LoadModule reply", t => {
  const f = fixtures.module.loadModule
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(LoadModule.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})
