import PAClient from './client'

async function main() {

  const client: PAClient = new PAClient('192.168.90.207:4317')
  console.log(await client.connect())
  console.log(await client.setClientName())
  console.log(await client.getSinks())
  console.log(await client.subscribe())

  client.on('sink', data => {
    console.log('mi');
    
    console.log(data)
    console.log('o');
  })
  
}
main()