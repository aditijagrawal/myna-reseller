export interface WebChatChannelSettings {
  aiAgentName: string
  resolvedEnabled: boolean
  resolvedName: string
  escalationEnabled: boolean
  escalationName: string
  duringEnabled: boolean
  afterEnabled: boolean
}

export interface TextChannelSettings {
  unsubscribeEnabled: boolean
  beforeEnabled: boolean
  afterEnabled: boolean
}

export const DEFAULT_WEBCHAT_CHANNEL_SETTINGS: WebChatChannelSettings = {
  aiAgentName: '',
  resolvedEnabled: true,
  resolvedName: 'That helped 👍',
  escalationEnabled: true,
  escalationName: 'Talk to human',
  duringEnabled: true,
  afterEnabled: true,
}

export const DEFAULT_TEXT_CHANNEL_SETTINGS: TextChannelSettings = {
  unsubscribeEnabled: false,
  beforeEnabled: true,
  afterEnabled: false,
}

export const WEBCHAT_FALLBACK_DURING =
  "We're not available right now. Our team will follow up during business hours. You can also reach us at {business.phone}"

export const WEBCHAT_FALLBACK_AFTER =
  "Our team is offline right now. Leave a message and we'll follow up during business hours. You can also call us at {business.phone}"

export const TEXT_FALLBACK_BEFORE =
  "We're not available right now. Our team will follow up during business hours. You can also reach us at {business.phone}"

export const TEXT_FALLBACK_AFTER =
  "Our team is offline right now. Leave a message and we'll follow up during business hours."
