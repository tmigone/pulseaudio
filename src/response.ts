import { authenticateReply } from './commands/authenticate'
import { setClientNameReply } from './commands/clientName'
import { subscribeReply } from './commands/subscribe'
import { serverInfoReply } from './commands/server'
import { getSinkInputReply, getSinkInputsReply, moveSinkInputReply } from './commands/sinkInput'


export default {
  setClientNameReply,
  authenticateReply,
  subscribeReply,
  serverInfoReply,
  getSinkInputReply,
  getSinkInputsReply,
  moveSinkInputReply
}
