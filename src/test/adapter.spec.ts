import MockChatController from "../controllers/MockChatController"
import AbstractLiveChatAdapter from "../services/abstracts/AbstractLiveChatAdapter"
import ILiveChatPublisher from "../services/interfaces/ILiveChatPublisher"
import ILiveChatSubscriber from "../services/interfaces/ILiveChatSubscriber"
import LiveChatAdapter from "../services/LiveChatAdapter"
import LiveChatCustomCommandAdapter from "../services/LiveChatCustomCommandAdapter"
import MockChatPublisher from "../services/MockChatPublisher"
import { loadCommandConfig } from "../utils/loadConfig"
import path from 'path'
import LiveChatReplaceAdapter from "../services/LiveChatReplaceAdapter"

const commandsConfig = loadCommandConfig(path.resolve(__dirname, './configs/commands.onlyDefined.json'))

let mockController: ILiveChatSubscriber = new MockChatController()
const mockPublisher: ILiveChatPublisher = new MockChatPublisher([
    "ขวาค้าง",
    "right holds",
    "t",
    "gg"
])

let customChatCommandAdapter: ILiveChatSubscriber
if (commandsConfig.useOnlyDefined) customChatCommandAdapter = new LiveChatCustomCommandAdapter(mockController, commandsConfig.commands)
else customChatCommandAdapter = new LiveChatAdapter(mockController, commandsConfig.commands)

if (commandsConfig.useReplace) {
    customChatCommandAdapter = new LiveChatReplaceAdapter(customChatCommandAdapter, commandsConfig.replaces)
}

mockPublisher.register(customChatCommandAdapter)
mockPublisher.start()