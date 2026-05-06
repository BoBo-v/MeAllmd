<template>
  <div>
    <div v-for="m in messages" :key="m.id">
      <b>{{ m.role }}:</b> {{ m.content }}
    </div>

    <div>
      <input v-model="input" @keyup.enter="handleSend" />
      <button @click="handleSend">发送</button>
      <button @click="stop">停止</button>
      <button @click="continueGenerate">继续生成</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import { useChat } from './composables/useChat'

const { messages, send,stop ,continueGenerate,setPersona  } = useChat()
const input = ref('')
function handleSend() {
  send(input.value)
  console.log(messages)
  input.value = ''
}
setPersona("normal")
/**
 * vue schedule
 *
 * trigger->effect->schedule->queueJob->Promise.then->flushJobs
 * 响应数据变了，找到触发effect，不直接执行effect,而是交给schedule,
 * scheduler把effect丢进队列（queue），用promise开一个微任务，在微任务里统一执行flushJobs
 *
 * set includes
 * 为什么 Promise 一定要放在 queueJob 里?
 * 因为schedule的目标是在任务入队时候决定是否调度，而不是在执行阶段
 * 如果把promise放在flushJobs里，会导致flushjobs根本不触发
 * 所以必须在queueJob中处理判断isPending并开启微任务，这样可以保证多次queuejob只触发一次flush
 *
 * 为什么 flushJobs 不能是异步？
 * flushjobs必须是同步的，因为它本身就是微任务同步执行代码的，如果flushjob内在嵌套promise
 * 就会导致执行顺序错乱，甚至出现嵌套调度问题
 *
 *
 */
//定义queue存储需要修改的任务去重 queueJob（）ispending校验开启微任务状态 通过后执行promise开启
//微任务队列调用flushJobs方法，fl遍历queue内的任务，执行任务，清空queue，重置isPending，isFlushing
//这是整个schedluer的核心逻辑
let queue=new Set()
let isPending=false
let isFlushing=false
function queueJob(fn){
  queue.add(fn)
  if(!isPending){
    Promise.resolve().then(flushJobs)
    isPending=true
  }

}
function flushJobs(){
  isFlushing=true

  const pending = [...queue]

  for (let i = 0; i < pending.length; i++) {
    pending[i]()
  }
    queue.clear()
    isFlushing=false
    isPending = false
}

function parseChunk(chunk) {
  // chunk 是这次 read() 拿到的字符串
  // 可能是完整的、也可能是残缺的
  //
  // 返回值：本次解析出的完整消息数组
  // 例如：[{content: "你"}, {content: "好"}]
  //
  // 你要做的：
  // 1. 把 chunk 拼到 buffer
  // 2. 按 \n\n 切分
  // 3. 最后一段留着（可能不完整）
  // 4. 前面的每一段去掉 "data: " 前缀
  // 5. JSON.parse
  // 6. 返回结果数组
  function parseChunk(chunk) {
  const result = []
  // 步骤1：拼接
  buffer +=chunk
  // 步骤2：切分
  const parts = buffer.split('\n\n')

  // 步骤3：最后一段留回 buffer（可能是残片）
  buffer =parts.pop()

  // 步骤4：遍历剩下的完整段
  for (const part of parts) {
    // 4.1 跳过空串
    if (part==='') continue

    // 4.2 去掉 "data: " 前缀
    const jsonStr = part.slice(6)

    // 4.3 解析
    const obj = JSON.parse(jsonStr)

    result.push(obj)
  }
  // 步骤5：返回
  return result
}
  let buffer = ''
  let messages = []

}

async function streamChat(prompt: string) {
  const res= await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
    ,
    body: JSON.stringify({
      prompt
    })
  })
  let bodys=res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer=[]
  while (true) {
    const { done, value } = await bodys.read()
    if(done) break
    const chunk=decoder.decode(value)
    const lines=chunk.split('\n')
    for (const line of lines){
      buffer.push(line)
    }
  }
}

let message=ref([])
function useStreamChat(){

  async function send(prompt:string){

    let newmessage={
      id:crypto.randomUUID(),
      role:'AI',
      status:'loading',
      content:'',

    }

    const res= await fetch('api/chat',{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt
      })
    })
    let oredad=res.body!.getReader()
    let buffer=''
    message.value.push(newmessage)
    const decoder = new TextDecoder()
    while(true){
      const {done,value}= await oredad.read()

      if(done){
        newmessage.status='done'
        break
      }
      const chunk=decoder.decode(value)

      const lines=buffer.split('\n')
      newmessage.status='streaming'
      for (const line of lines){
        buffer = lines.pop() || ''
        newmessage.content+=line

      }
    }

  }
  return {message, send}
}

function useDebounce(fn:(...agrs:any[])=>void,delay:number=500)
    :(...args:any[])=>void {
  let timer:number|null=null
  return function (...args:any[]){
    if(timer!==null)clearTimeout(timer)
    timer=setTimeout(()=>{
      fn(...args)
    },delay)
  }
}


function useDe<T extends any[]>(fn:(...args:T)=>void,delay:number=500){
  let tiemr:number|null=null
  return function (...args:T){
    if(tiemr!==null) clearTimeout(tiemr)
    tiemr=setTimeout(()=>{
      fn(...args)
    },delay)
  }
}
const greet = (name: string, age: number) => {
  console.log(`${name} is ${age}`)
}
useDe(greet,300)

interface USer{
  id:string,
  name:string,
  age:number
}

type UserKeys=keyof USer
type x=Pick<USer,'id'|'name'>
type Allstring<K extends string>={
  [P in K]:string
}
type Y=USer['id']

type MyPick<T, K extends keyof T> = {
  [E in K]: T[E]

}

type MyPick1<T> = {
  [RT in keyof T]?: T[RT]

}
//定义一个Mypick工具类型，接收两个泛型一个是T,一个是K（必须是T的key的某个子集）
//产出一个新的对象类型：遍历K里的每个key,叫它E,对应的字段类型是T里E的字段类型

interface User {
  id: string
  name: string
  age: number
}

type X ={title: string,
  author: string,
  pages: number,}
type UserPreview = MyPick<User, 'id' | 'name'>

// 如果你写对了,UserPreview 应该等价于:
// { id: string; name: string }

// 这个应该能正常赋值
const u: UserPreview = { id: '1', name: 'Alice' }

// 这个应该报错(缺 name)
const u2: UserPreview = { id: '1' }

// 这个应该报错(多了 age)
const u3: UserPreview = { id: '1', name: 'Alice', age: 18 }

type MyPartial<T>={
  [p in keyof T]?:T[p]
}


type MyReadonly<T> = {
  readonly [P in keyof T]: T[P]
}



/**
 * 流式代理的核心：node后端收到前端请求->fetch ollama拿到ReadableStream->不等全部读完，
 * 边读边写给前端的Response.关键词叫stream pipe。fastrify原生支持返回stream，这也是选他的原因
 * 之一。选fastify不选Express的原因是Express不支持stream pipe，而且原生支持async await，TS
 * 支持更好，并且插件体系cors,auth,rate,limit开箱即用
 */

class MyPromise {
  // 你的实现
  #state='pending'
  #value=undefined
  #callback=[]
  constructor(executor) {
    const resolve=(value)=>{
      if(this.#state!=='pending') return
      this.#state='fulfilled'
      this.#value=value
      this.#callback.forEach(cb=>cb.onFulfilled(value))
    }
    const reject=(reason)=>{
      if(this.#state!=='pending') return
      this.#state='rejected'
      this.#value=reason
      this.#callback.forEach(cb=>cb.onRejected(reason))
    }
    try {
      executor(resolve,reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled,onRejected){
    onFulfilled=typeof onFulfilled==='function'?onFulfilled:v=>v
    onRejected=typeof onRejected==='function'?onRejected:e=>{throw e}

    return new MyPromise((resolve,reject)=>{
      const handle=(fn,value)=>{
        queueMicrotask(()=>{
          try{
            const result=fn(value)
            if(result instanceof MyPromise){
              result.then(resolve,reject)
            }else{
              resolve(result)
            }
          }catch(e){
            reject(e)
          }
        })
      }
    })
  }
}

// 测试用例
const p = new MyPromise((resolve) => {
  setTimeout(() => resolve('ok'), 100)
})
p.then(v => {
  console.log(v) // 'ok'
  return v + '!'
}).then(v => {
  console.log(v) // 'ok!'
})
</script>