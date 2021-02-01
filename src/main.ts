import fs from 'fs'
import LiveChatController from './controllers/LiveChatController'
import ILiveChatSubscriber from './services/interfaces/ILiveChatSubscriber'
import ILiveChatPublisher from './services/interfaces/ILiveChatPublisher'
import YoutubeApiLiveChatPublisher from './services/YoutubeApiLiveChatPublisher'
import ScrapingLiveChatPublisher from './services/ScrapingLiveChatPublisher'

const raw_configs: string = fs.readFileSync('./config.json').toString()
const configs = JSON.parse(raw_configs)

const chatController: ILiveChatSubscriber = new LiveChatController()
const chatPublisher: ILiveChatPublisher = new ScrapingLiveChatPublisher(configs)

chatPublisher.register(chatController)
chatPublisher.start()