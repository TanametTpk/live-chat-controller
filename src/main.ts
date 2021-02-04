import LiveChatController from './controllers/LiveChatController'
import ILiveChatSubscriber from './services/interfaces/ILiveChatSubscriber'
import ILiveChatPublisher from './services/interfaces/ILiveChatPublisher'
import ScrapingLiveChatPublisher from './services/ScrapingLiveChatPublisher'
import ICommandSubscriber from './services/interfaces/ICommandSubscriber'
import LocalIOController from './controllers/LocalIOController'
import WebHookController from './controllers/WebHookController'
import ICommandPublisher from './services/interfaces/ICommandPublisher'
import LocalIOPublisher from './services/LocalIOPublisher'
import RobotJSIOController from './services/RobotJSIOController'
import LiveChatAdapter from './services/LiveChatAdapter'
import { loadCommandConfig, loadLiveChatConfig, loadWebHookConfig } from './utils/loadConfig'
import AbstractLiveChatAdapter from './services/abstracts/AbstractLiveChatAdapter'
import LiveChatCustomCommandAdapter from './services/LiveChatCustomCommandAdapter'
import IMacroPlayer from './services/interfaces/IMacroPlayer'
import MacroManager from './services/MacroManager'
import DiscordChatPublisher from './services/DiscordChatPublisher'

const liveChatConfig = loadLiveChatConfig('./config.json')
const commandsConfig = loadCommandConfig('./commands.json')
const webHookConfig = loadWebHookConfig('./webhook.json')

const ioController: RobotJSIOController = new RobotJSIOController()
const macroController: IMacroPlayer = MacroManager.getInstance()

const chatController: ILiveChatSubscriber = new LiveChatController(ioController, ioController, macroController)
const webHookController: ILiveChatSubscriber = new WebHookController(webHookConfig.urls)
const chatPublisher: ILiveChatPublisher = new ScrapingLiveChatPublisher(liveChatConfig)
const discordPublisher: ILiveChatPublisher = new DiscordChatPublisher('ODA2NzIxMjEwNjcwNzc2MzYy.YBtjrA.eNs7cs18ZIC5DBpFDpZMWHManGo')

let customChatCommandAdapter: AbstractLiveChatAdapter
if (commandsConfig.useOnlyDefined) {
    customChatCommandAdapter = new LiveChatCustomCommandAdapter(chatController, commandsConfig.commands)
}else {
    customChatCommandAdapter = new LiveChatAdapter(chatController, commandsConfig.commands)
}

const localController: ICommandSubscriber = new LocalIOController(ioController)
const ioPublisher: ICommandPublisher = new LocalIOPublisher()

ioPublisher.register(localController)
ioPublisher.start()

// chatPublisher.register(customChatCommandAdapter)
// chatPublisher.register(webHookController)
// chatPublisher.start()

discordPublisher.register(customChatCommandAdapter)
discordPublisher.start()