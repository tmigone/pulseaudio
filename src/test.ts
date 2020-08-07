// import PAPacket from './packet'
import PAClient from './index'

async function main() {

  const client: PAClient = new PAClient('192.168.90.170:4317', './cookie')
  await client.connect()
  await client.setClientName()
  await client.subscribe()
  client.on('all', data => {
    console.log(data)
  })

  let sinks = await client.getSinks()
  console.log(sinks)

  let sinkInput = await client.getSinkInput(0)
  console.log(sinkInput);
  
  // let res = await client.setSinkVolume('alsa_output.default', 40000)
  // console.log(res)

}
main()