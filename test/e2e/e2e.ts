/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
require('dotenv').config()
import PulseAudio, { Sink } from '../../src/index'

void (async () => {
  const { PULSE_SERVER_V13 } = process.env
  if (PULSE_SERVER_V13 === undefined) {
    throw new Error('PULSE_SERVER_V13 environment variable is not set')
  }

  const client: PulseAudio = new PulseAudio(PULSE_SERVER_V13)
  await client.connect()

  const sinks: Sink[] = await client.getSinkList()
  for (const sink of sinks) {
    await client.setSinkVolume(sink.index, 50)
  }

  client.disconnect()
})()
