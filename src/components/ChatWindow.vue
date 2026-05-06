<template>
  <div v-if="chat">
    <div v-for="msg in chat.state?.messages" :key="msg.id">
      <b>{{ msg.role }}:</b> {{ msg.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatManager } from '@/composables/useChatManager'

const manager = useChatManager()
const chat = computed(() => manager.currentChat)
</script>