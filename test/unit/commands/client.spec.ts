import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import { PA_PROTOCOL_MINIMUM_VERSION } from '../../../src/protocol'
import PAPacket from '../../../src/packet'
import { JSONParse, JSONStringify } from '../../../src/utils/bigInt'
import { SetClientName } from '../../../src/commands/client'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'client'
]

test.before(async _t => {
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }
})

// SetClientName
test('SetClientName query', t => {
  const f = fixtures.client.setClientName
  const [requestId, clientName] = f.queryParameters
  t.is(SetClientName.query(requestId, clientName).write().toString('hex'), f.queryBuffer)
})

test('SetClientName reply', t => {
  const f = fixtures.client.setClientName
  const packet = new PAPacket(Buffer.from(f.replyBuffer, 'hex'))
  t.deepEqual(SetClientName.reply(packet, PA_PROTOCOL_MINIMUM_VERSION), JSONParse(JSONStringify(f.replyObject)))
})
