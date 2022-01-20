# 🎶 @tmigone/pulseaudio 🎶
 ![NPM](https://img.shields.io/npm/v/@tmigone/pulseaudio.svg?logo=npm&logoColor=fff&label=NPM+package&color=limegreen&link=https://www.npmjs.com/package/@tmigone/pulseaudio) ![CI](https://github.com/tmigone/pulseaudio/workflows/ci/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/tmigone/pulseaudio/badge.svg?branch=refactor)](https://coveralls.io/github/tmigone/pulseaudio?branch=refactor)

`@tmigone/pulseaudio` is a TypeScript based client library for [PulseAudio](https://www.freedesktop.org/wiki/Software/PulseAudio/), the most popular sound server for Linux. This library allows you to easily build clients or applications that interact with a PulseAudio server over it's native protocol, for example media players/recorders, volume control applications, etc.


### Features
- Zero dependency fully typed TypeScript implementation of the PulseAudio client protocol
- Extensive testing suite
- Protocol features: 
  - authentication - provide authentication data for the server
  - transport - connect over UNIX domain sockets or TCP sockets
  - introspection - query, modify and operate on PulseAudio objects like modules, sinks, sources, etc.
  - events - subscribe to server-side object events like a sink starting playback, etc.
  - (To be implemented) streams - manage audio playback and recording using Node.js streams

## Installation

Install the library using [npm](https://www.npmjs.com/):
```bash
npm install @tmigone/pulseaudio
```

## Usage

```ts
import PulseAudio from '@tmigone/pulseaudio'

(async () => {
  // Connect using tcp or unix socket
  // const client: PulseAudio = new PulseAudio('unix:/run/pulse/pulseaudio.socket')
  const client: PulseAudio = new PulseAudio('tcp:192.168.1.10:4317')
  await client.connect()

  // Set volume of all sinks to 50%
  const sinks: Sink[] = await client.getSinkList()
  for (const sink of sinks) {
    await client.setSinkVolume(sink.index, 50)
  }

  // Close connection
  client.disconnect()
})()
```

## Documentation

Visit the [docs site](pulseaudio.tmigone.com) for in depth documentation on the library API's.