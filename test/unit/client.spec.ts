import test from 'ava'
import PulseAudio from '../../src/client'

test('PAClient.parseAdress: "tcp:host:port" address parsed correctly', t => {
  const client: PulseAudio = new PulseAudio('tcp:localhost:1234')
  t.deepEqual(client.pulseAddress, {
    host: 'localhost',
    port: 1234
  })
})

test('PAClient.parseAdress: "tcp:host" address parsed correctly', t => {
  const client: PulseAudio = new PulseAudio('tcp:localhost')
  t.deepEqual(client.pulseAddress, {
    host: 'localhost',
    port: 4317
  })
})

// test('PAClient.parseAdress: "unix:/path/to/socket" address parsed correctly', t => {
//   const client: PAClient = new PAClient('unix:/run/pulse/pulseaudio.socket')
//   t.deepEqual(client.pulseAddress, {
//     path: '/run/pulse/pulseaudio.socket'
//   })
// })

test('PAClient.parseAdress: "host:port" address parsed correctly', t => {
  const client: PulseAudio = new PulseAudio('localhost:1111')
  t.deepEqual(client.pulseAddress, {
    host: 'localhost',
    port: 1111
  })
})

test('PAClient.parseAdress: "bad-address" address throws error', t => {
  t.throws(() => {
    const client = new PulseAudio('bad-address')
    console.log(client)
  })
})
