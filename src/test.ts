// import PAPacket from './packet'
import PAClient from './index'

async function main() {

  const client: PAClient = new PAClient('192.168.90.170:4317')
  await client.connect()
  await client.setClientName()
  await client.subscribe()
  client.on('all', data => {
      console.log(data)
  })

  // let sinks = await client.getSinks()
  // console.log(sinks)

  let a = await client.moveSinkInput(0, 3)
  console.log(a)
  
  // let sinkInputs = await client.getSinkInputs()
  // console.log(sinkInputs)
  
  // let res = await client.setSinkVolume(0, 40000)
  // console.log(res)

}
main()