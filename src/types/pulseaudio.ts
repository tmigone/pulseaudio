export interface Sink {
  index: number,
  name: string,
  description: string,
  sampleSpec: SampleSpec,
  channelMap: ChannelMap,
  moduleIndex: number,
  channelVolumes: ChannelVolume,
  isMuted: boolean,
  monitorSourceIndex: number,
  monitorSourceName: string,
  latency: BigInt,
  driverName: string,
  flagsRaw: number,
  properties: [],
  configLatency: BigInt,
  baseVolume: number,
  state: number,
  volumeSteps: number,
  cardIndex: number,
  ports: number,
  activePortName: string,
  formats: Format[]
}

export type ChannelVolume = {
  channels: number,
  volumes: number[]
}

export interface ChannelMap {
  channels: number,
  types: number[]
}

export interface SampleSpec {
  format: number,
  channels: number,
  rate: number
}

export type Format = {
  encoding: number,
  properties: [string, string][]
}

export interface AuthInfo {
  protocol: number
}

export interface ClientInfo {
  index: number
}

export interface ServerInfo {
  name: string,
  version: string,
  user: string,
  hostname: string,
  sampleSpec: SampleSpec,
  defaultSink: string,
  defaultSource: string,
  cookie: number,
  channelMap: ChannelMap
}

export interface SubscribeInfo {
  success: boolean
}

export interface VolumeInfo {
  success: boolean
}