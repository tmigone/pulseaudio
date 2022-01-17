require('dotenv').config()
import test from 'ava'
import { loadFixture, Dictionary, Fixture } from '../fixtures'
import PAClient from '../../src/client'

const fixtures: Dictionary<Fixture> = {}
const fxToLoad = [
  'sink'
]

const { PULSE_SERVER_V13 } = process.env
if (PULSE_SERVER_V13 === undefined) {
  throw new Error('PULSE_SERVER_V13 environment variable is not set')
}
let client: PAClient

test.before(async _t => {
  // Load fixtures
  for (const fx of fxToLoad) {
    fixtures[fx] = await loadFixture(fx)
  }

  // Connect to PA
  client = new PAClient(PULSE_SERVER_V13)
  await client.connect()
})

test("Change sink volume", async t => {
  const sinks = await client.getSinkList()
  if (sinks.length === 0) {
    t.fail('No sink found')
    return
  }

  const sink = sinks[0]
  const SINK_VOLUME = 41
  await client.setSinkVolume(sink.index, SINK_VOLUME)

  const sink0 = await client.getSink(sink.index)

  t.is(SINK_VOLUME, sink0.channelVolume.volumes[0])
  t.is(SINK_VOLUME, sink0.channelVolume.volumes[1])
})
