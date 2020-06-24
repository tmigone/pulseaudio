import PAClient from './index'

async function main() {

  const client: PAClient = new PAClient('192.168.90.207:4317', './cookie')
  console.log(await client.connect())
  console.log(await client.setClientName())
  console.log(await client.getSinks())
  console.log(await client.subscribe())

  client.on('sink', data => {    
    console.log(data)
  })
  
}
main()