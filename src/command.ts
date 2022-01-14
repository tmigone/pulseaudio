import { PA_NATIVE_COMMAND_NAMES } from './commands'
import { authenticate, authenticateReply } from './commands/authenticate'
import { subscribe, subscribeReply } from './commands/subscribe'
import { serverInfo, serverInfoReply } from './commands/server'

export { PA_NATIVE_COMMAND_NAMES }

export default {
  // Commands
  authenticate,
  subscribe,
  serverInfo,

  // Replies
  authenticateReply,
  subscribeReply,
  serverInfoReply,
}