import PAPacket from './packet'

export type PAResponse = any

// PARequest represents a request made to a PulseAudio server
// query: the PAPacket sent to the server
// reply: the PAPacket received as a response from the server
export default class PARequest {
  id: number
  query: PAPacket
  reply: PAPacket

  timeout: number = 3500
  promise: Promise<PAResponse>
  resolve: (value?: PAResponse) => any
  reject: (value?: PAResponse) => any

  constructor(_id: number, _query: PAPacket) {
    this.id = _id
    this.query = _query
    this.promise = Promise.race<PAResponse>([
      new Promise<PAResponse>((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      }),
      new Promise<PAResponse>((_resolve, reject) => {
        setTimeout(() => {
          reject(new Error('PARequest timed out.'))
        }, this.timeout)
      })
    ])
  }
}