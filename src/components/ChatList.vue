<template>
  <div>
    <button v-for="(chat, id) in Array.from(manager.chats.entries())"
            :key="id"
            @click="manager.switchChat(id)">
      Chat {{ id.slice(0, 4) }}
    </button>
    <button @click="manager.createChat">New Chat</button>
  </div>
</template>

<script setup lang="ts">
import { useChatManager } from '@/composables/useChatManager'
const manager = useChatManager()
</script>