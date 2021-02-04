import fs from 'fs'

export interface CommandConfig {
    commands: KeywordConfig[]
    useOnlyDefined: boolean
}

export interface KeywordConfig {
    words: string[]
    toCommand: string
}

export interface YoutubeConfig {
    allow: boolean
    API_KEY: string
    CHANNEL_ID: string
    STREAM_ID: string
    INTERVAL: number
}

export interface WebHookConfig {
    urls: string[]
    allow: boolean
}

export interface DiscordConfig {
    token: string
    allow: boolean
}

export interface TwitchConfig {
    channel: string
    allow: boolean
}

export interface Configs {
    youtube: YoutubeConfig
    discord: DiscordConfig
    twitch: TwitchConfig
    webhooks: WebHookConfig
}

export const loadConfig = <T>(path: string): T => {
    const raw_configs: string = fs.readFileSync(path).toString()
    const configs: T = JSON.parse(raw_configs)
    return configs
}

export const readConfig = (path: string): Configs => {
    return loadConfig<Configs>(path)
}

export const loadYoutubeConfig = (path: string): YoutubeConfig => {
    return loadConfig<YoutubeConfig>(path)
}

export const loadCommandConfig = (path: string): CommandConfig => {
    return loadConfig<CommandConfig>(path)
}

export const loadWebHookConfig = (path: string): WebHookConfig => {
    return loadConfig<WebHookConfig>(path)
}

export const loadDiscordConfig = (path: string): DiscordConfig => {
    return loadConfig<DiscordConfig>(path)
}

export const loadTwitchConfig = (path: string): TwitchConfig => {
    return loadConfig<TwitchConfig>(path)
}