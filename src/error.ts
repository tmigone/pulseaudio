// See https://github.com/pulseaudio/pulseaudio/blob/v13.0/src/pulse/error.c
export enum PAErrorList {
  PA_OK = 'OK',
  PA_ERR_ACCESS = 'Access denied',
  PA_ERR_COMMAND = 'Unknown command',
  PA_ERR_INVALID = 'Invalid argument',
  PA_ERR_EXIST = 'Entity exists',
  PA_ERR_NOENTITY = 'No such entity',
  PA_ERR_CONNECTIONREFUSED = 'Connection refused',
  PA_ERR_PROTOCOL = 'Protocol error',
  PA_ERR_TIMEOUT = 'Timeout',
  PA_ERR_AUTHKEY = 'No authentication key',
  PA_ERR_INTERNAL = 'Internal error',
  PA_ERR_CONNECTIONTERMINATED = 'Connection terminated',
  PA_ERR_KILLED = 'Entity killed',
  PA_ERR_INVALIDSERVER = 'Invalid server',
  PA_ERR_MODINITFAILED = 'Module initialization failed',
  PA_ERR_BADSTATE = 'Bad state',
  PA_ERR_NODATA = 'No data',
  PA_ERR_VERSION = 'Incompatible protocol version',
  PA_ERR_TOOLARGE = 'Too large',
  PA_ERR_NOTSUPPORTED = 'Not supported',
  PA_ERR_UNKNOWN = 'Unknown error code',
  PA_ERR_NOEXTENSION = 'No such extension',
  PA_ERR_OBSOLETE = 'Obsolete functionality',
  PA_ERR_NOTIMPLEMENTED = 'Missing implementation',
  PA_ERR_FORKED = 'Client forked',
  PA_ERR_IO = 'Input/Output error',
  PA_ERR_BUSY = 'Device or resource busy'
};

export const PAError = Object.values(PAErrorList)
