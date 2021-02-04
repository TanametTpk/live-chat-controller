import MockChatController from "../controllers/MockChatController"
import AbstractLiveChatAdapter from "../services/abstracts/AbstractLiveChatAdapter"
import ILiveChatPublisher from "../services/interfaces/ILiveChatPublisher"
import ILiveChatSubscriber from "../services/interfaces/ILiveChatSubscriber"
import LiveChatAdapter from "../services/LiveChatAdapter"
import LiveChatCustomCommandAdapter from "../services/LiveChatCustomCommandAdapter"
import MockChatPublisher from "../services/MockChatPublisher"
import { loadCommandConfig } from "../utils/loadConfig"
import path from 'path'

const commandsConfig = loadCommandConfig(path.resolve(__dirname, './configs/commands.normal.json'))

const mockController: ILiveChatSubscriber = new MockChatController()
const mockPublisher: ILiveChatPublisher = new MockChatPublisher([
    "ขวาค้าง",
    "right holds",
    "rh",
    "macro-265771589919116"
])

let customChatCommandAdapter: AbstractLiveChatAdapter
if (commandsConfig.useOnlyDefined) customChatCommandAdapter = new LiveChatCustomCommandAdapter(mockController, commandsConfig.commands)
else customChatCommandAdapter = new LiveChatAdapter(mockController, commandsConfig.commands)

mockPublisher.register(customChatCommandAdapter)
mockPublisher.start()