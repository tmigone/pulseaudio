import { PACommandType } from './commands/common'
import { authenticate, authenticateReply } from './commands/authenticate'
import { setClientName, setClientNameReply } from './commands/clientName'
import { getSinks, getSinksReply } from './commands/sink'

export { PACommandType }

export {
  // Commands
  authenticate,
  setClientName,
  getSinks,

  // Replies
  setClientNameReply,
  authenticateReply,
  getSinksReply
}






