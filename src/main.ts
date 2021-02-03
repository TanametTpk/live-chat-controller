import LiveChatController from './controllers/LiveChatController'
import ILiveChatSubscriber from './services/interfaces/ILiveChatSubscriber'
import ILiveChatPublisher from './services/interfaces/ILiveChatPublisher'
import ScrapingLiveChatPublisher from './services/ScrapingLiveChatPublisher'
import ICommandSubscriber from './services/interfaces/ICommandSubscriber'
import LocalIOController from './controllers/LocalIOController'
import ICommandPublisher from './services/interfaces/ICommandPublisher'
import LocalIOPublisher from './services/LocalIOPublisher'
import RobotJSIOController from './services/RobotJSIOController'
import LiveChatAdapter from './services/LiveChatAdapter'
import { loadCommandConfig, loadLiveChatConfig } from './utils/loadConfig'
import AbstractLiveChatAdapter from './services/abstracts/AbstractLiveChatAdapter'
import LiveChatCustomCommandAdapter from './services/LiveChatCustomCommandAdapter'
import IMacroPlayer from './services/interfaces/IMacroPlayer'
import MacroManager from './services/MacroManager'

const liveChatConfig = loadLiveChatConfig('./config.json')
const commandsConfig = loadCommandConfig('./commands.json')

const ioController: RobotJSIOController = new RobotJSIOController()
const macroController: IMacroPlayer = MacroManager.getInstance()

const chatController: ILiveChatSubscriber = new LiveChatController(ioController, ioController, macroController)
const chatPublisher: ILiveChatPublisher = new ScrapingLiveChatPublisher(liveChatConfig)

let customChatCommandAdapter: AbstractLiveChatAdapter
if (commandsConfig.useOnlyDefined) customChatCommandAdapter = new LiveChatCustomCommandAdapter(chatController, commandsConfig.commands)
else customChatCommandAdapter = new LiveChatAdapter(chatController, commandsConfig.commands)

const localController: ICommandSubscriber = new LocalIOController(ioController)
const ioPublisher: ICommandPublisher = new LocalIOPublisher()

ioPublisher.register(localController)
ioPublisher.start()

chatPublisher.register(customChatCommandAdapter)
chatPublisher.start()