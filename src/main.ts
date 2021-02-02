import fs from 'fs'
import LiveChatController from './controllers/LiveChatController'
import ILiveChatSubscriber from './services/interfaces/ILiveChatSubscriber'
import ILiveChatPublisher from './services/interfaces/ILiveChatPublisher'
import YoutubeApiLiveChatPublisher from './services/YoutubeApiLiveChatPublisher'
import ScrapingLiveChatPublisher from './services/ScrapingLiveChatPublisher'
import ICommandSubscriber from './services/interfaces/ICommandSubscriber'
import LocalIOController from './controllers/LocalIOController'
import ICommandPublisher from './services/interfaces/ICommandPublisher'
import LocalIOPublisher from './services/LocalIOPublisher'
import RobotJSIOController from './services/RobotJSIOController'
import LiveChatAdapter from './services/LiveChatAdapter'

const raw_configs: string = fs.readFileSync('./config.json').toString()
const configs = JSON.parse(raw_configs)

const ioController: RobotJSIOController = new RobotJSIOController()

const chatController: ILiveChatSubscriber = new LiveChatController(ioController, ioController)
const customChatCommandAdapter: LiveChatAdapter = new LiveChatAdapter(chatController, [])
const chatPublisher: ILiveChatPublisher = new ScrapingLiveChatPublisher(configs)

const localController: ICommandSubscriber = new LocalIOController(ioController)
const ioPublisher: ICommandPublisher = new LocalIOPublisher()

ioPublisher.register(localController)
ioPublisher.start()

chatPublisher.register(customChatCommandAdapter)
chatPublisher.start()