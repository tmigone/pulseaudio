import PAPacket from '../../packet'
import { Index, Module } from '../../types/pulseaudio'

import GetModule from './getModule'
import GetModuleList from './getModuleList'
import LoadModule from './loadModule'
import UnloadModule from './unloadModule'

export {
  GetModule,
  GetModuleList,
  LoadModule,
  UnloadModule
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1121
export const parseModulePacket = (packet: PAPacket, _protocol: number): Module[] => {
  const modules: Module[] = []
  const tags = packet.getTagsIterable()
  
  while (!tags.done) {
    const module: Module = {
      index: tags.nextValue(),
      name: tags.nextValue(),
      argument: tags.nextValue(),
      usageCounter: tags.nextValue(),
      properties: tags.nextValue(),
    }
    modules.push(module)
  }
  return modules
}

// https://github.com/pulseaudio/pulseaudio/blob/v15.0/src/pulse/introspect.c#L1864
export const parseIndexPacket = (packet: PAPacket, _protocol: number): Index => {
  const tags = packet.getTagsIterable()
  const moduleIndex: Index = tags.nextValue()  
  return moduleIndex
}
