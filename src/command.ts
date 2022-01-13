import { PA_NATIVE_COMMAND_NAMES } from './commands'
import { authenticate, authenticateReply } from './commands/authenticate'
import { setClientName, setClientNameReply } from './commands/clientName'
import { subscribe, subscribeReply } from './commands/subscribe'
import { serverInfo, serverInfoReply } from './commands/server'
import { getSinkInput, getSinkInputReply, getSinkInputs, getSinkInputsReply, moveSinkInput, moveSinkInputReply } from './commands/sinkInput'

export { PA_NATIVE_COMMAND_NAMES }

export default {
  // Commands
  authenticate,
  setClientName,
  getSinkInput,
  getSinkInputs,
  subscribe,
  serverInfo,
  moveSinkInput,

  // Replies
  setClientNameReply,
  authenticateReply,
  getSinkInputReply,
  getSinkInputsReply,
  subscribeReply,
  serverInfoReply,
  moveSinkInputReply
}