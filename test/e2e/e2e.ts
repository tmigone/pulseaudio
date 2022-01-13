import PAClient from '../../src/client'

(async () => {
  const client: PAClient = new PAClient('tcp:192.168.90.115:4317')
  await client.connect()
  console.log(await client.getSinks())
  console.log(await client.getSink(0))
  client.disconnect()
})()
