import LiveChatController from "../controllers/LiveChatController"
import MockChatController from "../controllers/MockChatController"
import AbstractLiveChatAdapter from "../services/abstracts/AbstractLiveChatAdapter"
import ILiveChatPublisher from "../services/interfaces/ILiveChatPublisher"
import ILiveChatSubscriber from "../services/interfaces/ILiveChatSubscriber"
import IMacroPlayer from "../services/interfaces/IMacroPlayer"
import LiveChatAdapter from "../services/LiveChatAdapter"
import LiveChatCustomCommandAdapter from "../services/LiveChatCustomCommandAdapter"
import MacroManager from "../services/MacroManager"
import MockChatPublisher from "../services/MockChatPublisher"
import RobotJSIOController from "../services/RobotJSIOController"
import { loadCommandConfig, loadWebHookConfig } from "../utils/loadConfig"
import path from 'path'
import { setTimeout } from "timers"
import WebHookController from "../controllers/WebHookController"

const commandsConfig = loadCommandConfig(path.resolve(__dirname, './configs/commands.normal.json'))
const webHookConfig = loadWebHookConfig('./webhook.json')
// const commandsConfig = loadCommandConfig(path.resolve(__dirname, './configs/commands.onlyDefined.json'))

const mockController: ILiveChatSubscriber = new MockChatController()
// const ioController: RobotJSIOController = new RobotJSIOController()
// const macroController: IMacroPlayer = MacroManager.getInstance()
const webHookController: ILiveChatSubscriber = new WebHookController(webHookConfig.urls)

// const mockController: ILiveChatSubscriber = new LiveChatController(ioController, ioController, macroController)
const mockPublisher: ILiveChatPublisher = new MockChatPublisher([
    // "ขวาค้าง",
    // "right holds",
    // "rh"
    "macro-265771589919116"
])
setTimeout(() => {
    let customChatCommandAdapter: AbstractLiveChatAdapter
    if (commandsConfig.useOnlyDefined) customChatCommandAdapter = new LiveChatCustomCommandAdapter(mockController, commandsConfig.commands)
    else customChatCommandAdapter = new LiveChatAdapter(mockController, commandsConfig.commands)

    mockPublisher.register(customChatCommandAdapter)
    mockPublisher.register(webHookController)
    mockPublisher.start()
}, 1000)