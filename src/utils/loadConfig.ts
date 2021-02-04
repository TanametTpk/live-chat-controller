import fs from 'fs'

export interface CommandConfig {
    commands: KeywordConfig[]
    useOnlyDefined: boolean
}

export interface KeywordConfig {
    words: string[]
    toCommand: string
}

export interface LiveChatConfig {
    API_KEY: string
    CHANNEL_ID: string
    STREAM_ID: string
    INTERVAL: number
}

export interface WebHookConfig {
    urls: string[]
}

export const loadConfig = <T>(path: string): T => {
    const raw_configs: string = fs.readFileSync(path).toString()
    const configs: T = JSON.parse(raw_configs)
    return configs
}

export const loadLiveChatConfig = (path: string): LiveChatConfig => {
    return loadConfig<LiveChatConfig>(path)
}

export const loadCommandConfig = (path: string): CommandConfig => {
    return loadConfig<CommandConfig>(path)
}

export const loadWebHookConfig = (path: string): WebHookConfig => {
    return loadConfig<WebHookConfig>(path)
}