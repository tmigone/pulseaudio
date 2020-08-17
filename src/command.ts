import { PACommandType } from './commands/common'
import { authenticate, authenticateReply } from './commands/authenticate'
import { setClientName, setClientNameReply } from './commands/clientName'
import { getSinks, getSink, getSinksReply, getSinkReply, setSinkVolume, setSinkVolumeReply } from './commands/sink'
import { subscribe, subscribeReply } from './commands/subscribe'
import { serverInfo, serverInfoReply } from './commands/server'
import { getSinkInput, getSinkInputReply, getSinkInputs, getSinkInputsReply, moveSinkInput, moveSinkInputReply } from './commands/sinkInput'

export { PACommandType }

export default {
  // Commands
  authenticate,
  setClientName,
  getSinks,
  getSink,
  getSinkInput,
  getSinkInputs,
  subscribe,
  setSinkVolume,
  serverInfo,
  moveSinkInput,
  
  // Replies
  setClientNameReply,
  authenticateReply,
  getSinksReply,
  getSinkReply,
  getSinkInputReply,
  getSinkInputsReply,
  subscribeReply,
  setSinkVolumeReply,
  serverInfoReply,
  moveSinkInputReply
}






