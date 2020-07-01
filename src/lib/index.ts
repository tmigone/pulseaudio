import PAClient from '../index'
import { EventEmitter } from 'events'

export default class BalenaAudio extends EventEmitter {
  private client: PAClient

  constructor(
    public address: string = 'tcp:audio:4317',
    public cookie: string = './cookie',
    public subscribe: boolean = true
  ) {
    super()
    this.client = new PAClient(address, cookie)
  }

  async start() {
    await this.client.connect()
    await this.client.setClientName('BalenaAudio')

    if (this.subscribe) {
      await this.client.subscribe()

      this.client.on('sink', async data => {
        let sink = await this.client.getSink(data.index)
        this.emit('sink', sink)
      })
    }
  }
}

let client: BalenaAudio = new BalenaAudio('192.168.90.207:4317')
client.start()

client.on('sink', data => {
  console.log(data)
})