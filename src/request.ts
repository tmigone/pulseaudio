import PAPacket from './packet'

// PARequest represents a request made to a PulseAudio server
// query: the PAPacket sent to the server
// reply: the PAPacket received as a response from the server
export default class PARequest {
  id: number
  query: PAPacket
  reply: PAPacket

  timeout: number = 3500
  promise: Promise<any>
  resolve: (value?: any) => any
  reject: (value?: any) => any

  constructor(_id: number, _query: PAPacket) {
    this.id = _id
    this.query = _query
    this.promise = Promise.race<any>([
      new Promise<any>((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      }),
      new Promise<any>((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error('PARequest timed out.'))
        }, this.timeout)
      })
    ])
  }
}