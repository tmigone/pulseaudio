import { ServerInfo } from '../..'
import PAPacket from '../../packet'
import Authenticate from './authenticate'
import GetServerInfo from './getServerInfo'
import Subscribe from './subscribe'

export {
  Authenticate,
  GetServerInfo,
  Subscribe
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L83
export const parseServerInfoPacket = (packet: PAPacket, _protocol: number): ServerInfo[] => {
  const serverInfos: ServerInfo[] = []
  const tags = packet.getTagsIterable()

  while (!tags.done) {
    const serverInfo: ServerInfo = {
      name: tags.nextValue(),
      version: tags.nextValue(),
      user: tags.nextValue(),
      hostname: tags.nextValue(),
      sampleSpec: tags.nextValue(),
      defaultSink: tags.nextValue(),
      defaultSource: tags.nextValue(),
      cookie: tags.nextValue(),
      channelMap: tags.nextValue()
    }

    serverInfos.push(serverInfo)
  }

  return serverInfos
}
