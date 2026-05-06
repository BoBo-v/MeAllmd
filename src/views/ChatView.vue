<template>
  <div style="display:flex; gap:20px;">
    <div style="width:200px;">
      <ChatList />
    </div>

    <div style="flex:1;">
      <ChatWindow />
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatList from '@/components/ChatList.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ChatInput from '@/components/ChatInput.vue'

class MyPromise {
  #state = 'pending'
  #value = undefined
  #callbacks = []

  constructor(executor) {
    const resolve = (value) => {
      if (this.#state !== 'pending') return
      this.#state = 'fulfilled'
      this.#value = value
      this.#callbacks.forEach(cb => cb.onFulfilled(value))
    }
    const reject = (reason) => {
      if (this.#state !== 'pending') return
      this.#state = 'rejected'
      this.#value = reason
      this.#callbacks.forEach(cb => cb.onRejected(reason))
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    // 值穿透
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    return new MyPromise((resolve, reject) => {
      const handle = (fn, value) => {
        // 用 queueMicrotask 保证异步
        queueMicrotask(() => {
          try {
            const result = fn(value)
            // 如果返回的是 Promise，跟随它的状态
            if (result instanceof MyPromise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (e) {
            reject(e)
          }
        })
      }

      if (this.#state === 'fulfilled') {
        handle(onFulfilled, this.#value)
      } else if (this.#state === 'rejected') {
        handle(onRejected, this.#value)
      } else {
        // pending 状态，存回调
        this.#callbacks.push({
          onFulfilled: (v) => handle(onFulfilled, v),
          onRejected: (r) => handle(onRejected, r),
        })
      }
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  static resolve(value) {
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason))
  }
}
</script>