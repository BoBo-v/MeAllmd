export type ChatRole = 'user' | 'assistant'
type ChatState = 'idle' | 'streaming' | 'error'

export interface Message {
    id: string
    role: ChatRole
    content: string
    status?: 'streaming' | 'done' | 'error'
}

export interface ChatState {
    messages: Message[]
    streaming: boolean
    controller: AbortController | null
    requestId: string | null
}

export interface ChatManagerState {
    chats: Map<string, ReturnType<typeof import('../composables/useChat').useChat>>
    activeChatId: string | null
}
