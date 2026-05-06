import { ref, computed } from 'vue'
import { useChat } from './useChat'

const chats = new Map<string, ReturnType<typeof useChat>>() // 🔥 单例
const activeChatId = ref<string | null>(null)

export function useChatManager() {

    function createChat() {
        const id = crypto.randomUUID()
        const chat = useChat()
        chats.set(id, chat)
        activeChatId.value = id
    }

    function switchChat(id: string) {
        if (chats.has(id)) activeChatId.value = id
    }

    const currentChat = computed(() => {
        return activeChatId.value ? chats.get(activeChatId.value) : null
    })

    return { chats, activeChatId, currentChat, createChat, switchChat }
}