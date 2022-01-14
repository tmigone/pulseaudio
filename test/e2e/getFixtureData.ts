require('dotenv').config()
import * as fs from 'fs'
import * as path from 'path'
import PAClient from '../../src/client'
import { JSONStringify } from '../../src/utils/bigInt'

(async () => {
  const { PULSE_SERVER_V13 } = process.env
  if (PULSE_SERVER_V13 === undefined) {
    throw new Error('PULSE_SERVER_V13 environment variable is not set')
  }

  // Clean files from previous run
  fs.readdirSync(process.cwd())
    .filter(f => /^PAPacket\./.test(f) || f === 'PACommand.data')
    .map(f => fs.unlinkSync(path.join(process.cwd(), f)))

  const client: PAClient = new PAClient(PULSE_SERVER_V13)
  await client.connect()

  process.env.DEBUG_PRINT = 'true'

  // 
  const data = await client.setSinkVolume(0, 90) // Edit command here
  // 

  fs.writeFileSync('PACommand.data', JSONStringify(data))
  client.disconnect()
})()
