import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import { PA_PROTOCOL_MINIMUM_VERSION } from '../../../src/protocol'
import PAPacket from '../../../src/packet'
import { JSONParse, JSONStringify } from '../../../src/utils/bigInt'
import { Authenticate, GetServerInfo, Subscribe } from '../../../src/commands/server'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'server'
]

test.before(async _t => {
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }
})

// Authenticate
test("Authenticate query", t => {
  const f = fixtures.server.authenticate
  const [ requestId, cookie ] = f.queryParameters
  t.is(Authenticate.query(requestId, Buffer.from(cookie, 'hex')).write().toString('hex'), f.queryBuffer)
})

test("Authenticate reply", t => {
  const f = fixtures.server.authenticate
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(Authenticate.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// GetServerInfo
test("GetServerInfo query", t => {
  const f = fixtures.server.getServerInfo
  const [ requestId ] = f.queryParameters
  t.is(GetServerInfo.query(requestId).write().toString('hex'), f.queryBuffer)
})

test("GetServerInfo reply", t => {
  const f = fixtures.server.getServerInfo
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(GetServerInfo.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

// Subscribe
test("Subscribe query", t => {
  const f = fixtures.server.subscribe
  const [ requestId ] = f.queryParameters
  t.is(Subscribe.query(requestId).write().toString('hex'), f.queryBuffer)
})

test("Subscribe reply", t => {
  const f = fixtures.server.subscribe
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(Subscribe.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})

