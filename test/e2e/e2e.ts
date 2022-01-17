require('dotenv').config()
import PAClient from '../../src/client'

(async () => {
  const { PULSE_SERVER_V13 } = process.env
  if (PULSE_SERVER_V13 === undefined) {
    throw new Error('PULSE_SERVER_V13 environment variable is not set')
  }

  const client: PAClient = new PAClient(PULSE_SERVER_V13)
  await client.connect()
  console.log(await client.getModuleList())
  client.disconnect()
})()
