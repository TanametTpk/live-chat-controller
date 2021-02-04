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
import { loadCommandConfig, loadDiscordConfig, loadLiveChatConfig, loadWebHookConfig } from './utils/loadConfig'
import AbstractLiveChatAdapter from './services/abstracts/AbstractLiveChatAdapter'
import LiveChatCustomCommandAdapter from './services/LiveChatCustomCommandAdapter'
import IMacroPlayer from './services/interfaces/IMacroPlayer'
import MacroManager from './services/MacroManager'
import DiscordChatPublisher from './services/DiscordChatPublisher'

const liveChatConfig = loadLiveChatConfig('./config.json')
const commandsConfig = loadCommandConfig('./commands.json')
const webHookConfig = loadWebHookConfig('./webhook.json')
const discordConfig = loadDiscordConfig('./discord.json')

const ioController: RobotJSIOController = new RobotJSIOController()
const localController: ICommandSubscriber = new LocalIOController(ioController)
const macroController: IMacroPlayer = MacroManager.getInstance()

const chatSubscriber: ILiveChatSubscriber = new LiveChatController(ioController, ioController, macroController)
const webHookSubscriber: ILiveChatSubscriber = new WebHookController(webHookConfig.urls)

const ioPublisher: ICommandPublisher = new LocalIOPublisher()
const chatPublisher: ILiveChatPublisher = new ScrapingLiveChatPublisher(liveChatConfig)
const discordPublisher: ILiveChatPublisher = new DiscordChatPublisher(discordConfig.token)

let customChatCommandAdapter: AbstractLiveChatAdapter
if (commandsConfig.useOnlyDefined) {
    customChatCommandAdapter = new LiveChatCustomCommandAdapter(chatSubscriber, commandsConfig.commands)
}else {
    customChatCommandAdapter = new LiveChatAdapter(chatSubscriber, commandsConfig.commands)
}

ioPublisher.register(localController)
ioPublisher.start()

chatPublisher.register(customChatCommandAdapter)
chatPublisher.register(webHookSubscriber)
chatPublisher.start()

if (discordConfig.allow) {
    discordPublisher.register(customChatCommandAdapter)
    discordPublisher.start()
}