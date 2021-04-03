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
import { loadCommandConfig, readConfig } from './utils/loadConfig'
import AbstractLiveChatAdapter from './services/abstracts/AbstractLiveChatAdapter'
import LiveChatCustomCommandAdapter from './services/LiveChatCustomCommandAdapter'
import IMacroPlayer from './services/interfaces/IMacroPlayer'
import MacroManager from './services/MacroManager'
import DiscordChatPublisher from './services/DiscordChatPublisher'
import TwitchChatPublisher from './services/TwitchChatPublisher'
import YoutubeApiLiveChatPublisher from './services/YoutubeApiLiveChatPublisher'
import WebServerController from './controllers/WebServerController'
import LiveChatReplaceAdapter from './services/LiveChatReplaceAdapter'
import PoolCommandAdapter from './services/PoolCommandAdapter'
import FacebookPublisher from './services/FacebookPublisher'

const configs = readConfig('./config.json')
const commandsConfig = loadCommandConfig('./commands.json')

const webServer: WebServerController = WebServerController.getInstance(3000)

const ioController: RobotJSIOController = new RobotJSIOController()
const localController: ICommandSubscriber = new LocalIOController(ioController)
const macroController: IMacroPlayer = MacroManager.getInstance()

const chatSubscriber: ILiveChatSubscriber = new LiveChatController(ioController, ioController, macroController)
let webHookSubscriber: ILiveChatSubscriber = new WebHookController(configs.webhooks.urls)

const ioPublisher: ICommandPublisher = new LocalIOPublisher()
const discordPublisher: ILiveChatPublisher = new DiscordChatPublisher(configs.discord.token)
const twitchPublisher: ILiveChatPublisher = new TwitchChatPublisher(configs.twitch.channel)
const facebookPublisher: ILiveChatPublisher = new FacebookPublisher(configs.facebook.access_token, configs.facebook.video_id)

let chatPublisher: ILiveChatPublisher
if (configs.youtube.useAPI) chatPublisher = new YoutubeApiLiveChatPublisher(configs.youtube)
else chatPublisher = new ScrapingLiveChatPublisher(configs.youtube)

let customChatCommandAdapter: AbstractLiveChatAdapter
if (commandsConfig.useOnlyDefined) {
    customChatCommandAdapter = new LiveChatCustomCommandAdapter(chatSubscriber, commandsConfig.commands)
}else {
    customChatCommandAdapter = new LiveChatAdapter(chatSubscriber, commandsConfig.commands)
}

if (commandsConfig.useReplace) {
    customChatCommandAdapter = new LiveChatReplaceAdapter(customChatCommandAdapter, commandsConfig.replaces)
}

if (commandsConfig.usePool) {
    webHookSubscriber = new PoolCommandAdapter(webHookSubscriber, commandsConfig.replaces, commandsConfig.pool)
}
let allowList: boolean[] = [
    configs.youtube.allow,
    configs.discord.allow,
    configs.twitch.allow,
    configs.facebook.allow
]

let publishers: ILiveChatPublisher[] = [
    chatPublisher,
    discordPublisher,
    twitchPublisher,
    facebookPublisher
]

ioPublisher.register(localController)
ioPublisher.start()

for (let i = 0; i < publishers.length; i++) {
    if (!allowList[i]) continue
    const publisher = publishers[i];
    
    publisher.register(customChatCommandAdapter)
    if (configs.webhooks.allow) publisher.register(webHookSubscriber)

    publisher.start()
}

webServer.start()