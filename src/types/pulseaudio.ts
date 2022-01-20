export interface Module {
  index: number
  name: string
  argument: string
  usageCounter: number
  properties: []
}

export interface Index {
  index: number
}

export interface Sink {
  index: number
  name: string
  description: string
  sampleSpec: SampleSpec
  channelMap: ChannelMap
  moduleIndex: number
  channelVolume: ChannelVolume
  isMuted: boolean
  monitorSourceIndex: number
  monitorSourceName: string
  latency: BigInt
  driverName: string
  flagsRaw: number
  properties: []
  configLatency: BigInt
  baseVolume: number
  state: number
  volumeSteps: number
  cardIndex: number
  numberPorts: number
  ports?: Port[]
  activePortName?: string
  formats?: Format[]
}

export interface Port {
  name: string
  description: string
  priority: number
  availabe?: boolean
  availabilityGroup?: string
  type?: number
}

export interface SinkInput {
  index: number
  name: string
  moduleIndex: number
  clientIndex: number
  sinkIndex: number
  sampleSpec: SampleSpec
  channelMap: ChannelMap
  channelVolume: ChannelVolume
  bufferLatency: BigInt
  sinkLatency: BigInt
  resampleMethod: string
  driverName: string
  isMuted?: boolean
  properties?: []
  isCorked?: boolean
  hasVolume?: boolean
  isVolumeWritable?: boolean
  format?: Format
}

export interface Source {
  index: number
  name: string
  description: string
  sampleSpec: SampleSpec
  channelMap: ChannelMap
  moduleIndex: number
  channelVolume: ChannelVolume
  isMuted: boolean
  monitorSinkIndex: number
  monitorSinkName: number
  latency: BigInt
  driverName: string
  flagsRaw: number
  properties: []
  configLatency: BigInt
  baseVolume: number
  state: number
  volumeSteps: number
  cardIndex: number
  numberPorts: number
  ports?: Port[]
  activePortName?: string
  formats?: Format[]
}

export interface SourceOutput {
  index: number
  name: string
  moduleIndex: number
  clientIndex: number
  sourceIndex: number
  sampleSpec: SampleSpec
  channelMap: ChannelMap
  bufferLatency: BigInt
  sourceLatency: BigInt
  resampleMethod: string
  driverName: string
  properties?: []
  isCorked?: boolean
  channelVolume: ChannelVolume
  isMuted?: boolean
  hasVolume?: boolean
  isVolumeWritable?: boolean
  format?: Format
}

export interface ChannelVolume {
  channels: number
  volumes: number[]
}

export interface ChannelMap {
  channels: number
  types: number[]
}

export interface SampleSpec {
  format: number
  channels: number
  rate: number
}

export interface Format {
  encoding: number
  properties: Array<[string, string]>
}

export interface AuthInfo {
  protocol: number
}

export interface ClientInfo {
  index: number
}

export interface ServerInfo {
  name: string
  version: string
  user: string
  hostname: string
  sampleSpec: SampleSpec
  defaultSink: string
  defaultSource: string
  cookie: number
  channelMap: ChannelMap
}

export interface Status {
  success: boolean
}

export interface SubscribeInfo extends Status {
}

export interface VolumeInfo extends Status {
}
