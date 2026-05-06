<template>
  <input v-model="input" @keyup.enter="sendMessage"/>
  <button @click="stopMessage">Stop</button>
  <button @click="retryMessage">Retry</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatManager } from '@/composables/useChatManager'

const manager = useChatManager()
const input = ref('')

function sendMessage() {
  manager.currentChat?.value?.send(input.value)
  input.value = ''
}
function stopMessage() { manager.currentChat?.value?.stop() }
function retryMessage() { manager.currentChat?.value?.retry() }
</script>