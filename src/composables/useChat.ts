import { ref } from 'vue'
import { createChatStream } from '../services/stream'

export function useChat() {
    const messages = ref<{ role: string; content: string }[]>([])
    const state = ref<ChatState>('idle')
    let controller: AbortController | null = null

    let bufferMap = new Map<string, string[]>()
    let isFlushing = false
    let currentRequestId: string | null = null


    async function send(message: string) {
        if (state.value === 'streaming') return

        state.value = 'streaming'
        controller = new AbortController()
        const requestId = crypto.randomUUID()
        currentRequestId = requestId
        bufferMap.set(requestId, [])

        // 1. 用户消息
        messages.value.push({ id: crypto.randomUUID(), role: 'user', content: message })

        // 2. 准备一个 AI 消息占位
        const assistantId = crypto.randomUUID()
        messages.value.push({ id: assistantId, role: 'assistant', content: '' })

        try {
            // 【关键修复】：直接发送 messages 数组给后端，不要在前端拼 prompt
            const res = await fetch('http://localhost:3001/api/chat', {
                method: 'POST',
                body: JSON.stringify({ messages: messages.value ,model: 'qwen2.5:7b'}), // 字段名改为 messages
                signal: controller.signal,
                headers: { 'Content-Type': 'application/json' },
            })

            if (!res.ok) throw new Error('Server Error')

            const reader = res.body!.getReader()
            const decoder = new TextDecoder()

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                if (currentRequestId !== requestId) break

                const chunk = decoder.decode(value)
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (!line.trim()) continue
                    try {
                        const data = JSON.parse(line)
                        const msg = messages.value.find(m => m.id === assistantId)

                        // 这里的 data.response 必须和后端 res.write 里的 key 一致
                        const content = data.message?.content
                        if (msg && content) {
                            bufferMap.get(requestId)?.push(content)
                            flushBuffer(msg, requestId)
                        }
                    } catch (e) {
                        // 如果后端传的不是 JSON，这里会报错，加上 log 方便调试
                        console.error("解析失败的内容:", line)
                    }
                }
            }
            state.value = 'idle'
        } catch (e) {
            state.value = 'error'
        }
    }
    function flushBuffer(msg: any,requestId: string) {
        const buffer = bufferMap.get(requestId)
        if (!buffer) return
        if (isFlushing) return
        console.log('flushBuffer',requestId,msg)
        isFlushing = true
        function loop() {
            if (currentRequestId !== requestId) {
                isFlushing = false
                return
            }

            if (buffer.length === 0) {
                isFlushing = false
                return
            }

            // 每帧只消费一点
            const chunk = buffer.shift()

            if (chunk) {
                msg.content += chunk
            }

            requestAnimationFrame(loop)
        }

        requestAnimationFrame(loop)
    }
    function stop() {
        if (controller) {
            controller.abort()
            currentRequestId = null
            state.value = 'idle'
            console.log('用户中断')
        }
    }

    const systemPrompt = ref(`
You are a helpful AI assistant.
`)
    function buildPrompt(messages: Message[]) {
        const MAX_HISTORY = 6
        // const MAX_PROMPT_LENGTH = 4000
        // if (prompt.length > MAX_PROMPT_LENGTH) {
        //     console.warn('prompt too long, truncated')
        // }

        const recentMessages = messages.slice(-MAX_HISTORY)
        const history = recentMessages
            .map(m => {
                return m.role === 'user'
                    ? `User: ${m.content}`
                    : `Assistant: ${m.content}`
            })
            .join('\n')

        return `
            ### System
            ${systemPrompt.value}
            
            ### Conversation
            ${history}
            `
    }
    function continueGenerate() {
        if (state.value === 'streaming') return

        // 找最后一条 assistant
        const last = [...messages.value].reverse().find(m => m.role === 'assistant')

        if (!last) return

        send('继续')
    }
    function setPersona(type: 'normal' | 'toxic') {
        if (type === 'normal') {
            systemPrompt.value = `
You are a helpful AI assistant.
Be polite and professional.
`
        }

        if (type === 'toxic') {
            systemPrompt.value = `
You are a sarcastic and sharp-tongued AI.
Be witty, ironic, and slightly rude.
Do not be polite.
`
        }
    }

    return { messages, send ,stop,continueGenerate,setPersona  }
}