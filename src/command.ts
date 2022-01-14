import { PA_NATIVE_COMMAND_NAMES } from './commands'
import { authenticate, authenticateReply } from './commands/authenticate'
import { setClientName, setClientNameReply } from './commands/clientName'
import { subscribe, subscribeReply } from './commands/subscribe'
import { serverInfo, serverInfoReply } from './commands/server'

export { PA_NATIVE_COMMAND_NAMES }

export default {
  // Commands
  authenticate,
  setClientName,
  subscribe,
  serverInfo,

  // Replies
  setClientNameReply,
  authenticateReply,
  subscribeReply,
  serverInfoReply,
}