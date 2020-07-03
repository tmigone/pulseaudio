import { authenticateReply } from './commands/authenticate'
import { setClientNameReply } from './commands/clientName'
import { getSinksReply, getSinkReply, setSinkVolumeReply } from './commands/sink'
import { subscribeReply } from './commands/subscribe'
import { serverInfoReply } from './commands/server'


export default {
  setClientNameReply,
  authenticateReply,
  getSinksReply,
  getSinkReply,
  subscribeReply,
  setSinkVolumeReply,
  serverInfoReply
}
