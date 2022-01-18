/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
require('dotenv').config()
import PulseAudio from '../../src/client'

void (async () => {
  const { PULSE_SERVER_V13 } = process.env
  if (PULSE_SERVER_V13 === undefined) {
    throw new Error('PULSE_SERVER_V13 environment variable is not set')
  }

  const client: PulseAudio = new PulseAudio(PULSE_SERVER_V13)
  await client.connect()
  console.log(await client.getSourceList())
  client.disconnect()
})()
