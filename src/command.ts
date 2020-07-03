import { PACommandType } from './commands/common'
import { authenticate, authenticateReply } from './commands/authenticate'
import { setClientName, setClientNameReply } from './commands/clientName'
import { getSinks, getSink, getSinksReply, getSinkReply, setSinkVolume, setSinkVolumeReply } from './commands/sink'
import { subscribe, subscribeReply } from './commands/subscribe'
import { serverInfo, serverInfoReply } from './commands/server'

export { PACommandType }

export default {
  // Commands
  authenticate,
  setClientName,
  getSinks,
  getSink,
  subscribe,
  setSinkVolume,
  serverInfo,
  
  // Replies
  setClientNameReply,
  authenticateReply,
  getSinksReply,
  getSinkReply,
  subscribeReply,
  setSinkVolumeReply,
  serverInfoReply
}






