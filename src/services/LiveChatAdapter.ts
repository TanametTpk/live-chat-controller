import chat from "../models/chat"
import ILiveChatSubscriber from "./interfaces/ILiveChatSubscriber"

export interface KeywordConfig {
    words: string[]
    toCommand: string
} 

export default class LiveChatAdapter implements ILiveChatSubscriber {
    private keywordMapping: Map<string, string>
    private liveChatSubscriber: ILiveChatSubscriber

    public constructor(liveChatSubscriber: ILiveChatSubscriber, configs: KeywordConfig[]) {
        this.keywordMapping = new Map()
        this.liveChatSubscriber = liveChatSubscriber
        this.mapConfig(configs)
    }

    private mapConfig(configs: KeywordConfig[]) {
        for (let i = 0; i < configs.length; i++) {
            const config = configs[i];
            
            for (let j = 0; j < config.words.length; j++) {
                const word = config.words[j];
                this.keywordMapping.set(word, config.toCommand)
            }
        }
    }

    public receivedChat(chats: chat[]) {
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            if (this.isHaveWordInConfig(chat.message)) {
                chats[i].message = this.getNewKeyword(chats[i].message)
            }
        }

        this.liveChatSubscriber.receivedChat(chats)
    }

    private isHaveWordInConfig(word: string) {
        return this.keywordMapping.has(word)
    }

    private getNewKeyword(word: string): string {
        return this.keywordMapping.get(word)!
    }
}