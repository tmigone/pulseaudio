import { PACommandType } from './commands/common'
import { authenticate, authenticateReply } from './commands/authenticate'
import { setClientName, setClientNameReply } from './commands/clientName'
import { getSinks, getSink, getSinksReply, getSinkReply, setSinkVolume, setSinkVolumeReply } from './commands/sink'
import { subscribe, subscribeReply } from './commands/subscribe'

export { PACommandType }

export {
  // Commands
  authenticate,
  setClientName,
  getSinks,
  getSink,
  subscribe,
  setSinkVolume,
  
  // Replies
  setClientNameReply,
  authenticateReply,
  getSinksReply,
  getSinkReply,
  subscribeReply,
  setSinkVolumeReply
}






