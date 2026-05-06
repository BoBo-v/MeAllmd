## 当前状态(2026-04-22 更新)

### 阶段
Phase 1 - Month 1 - Week 1 - Day 1 完成 / Day 2 待启动

### 18 个月目标
成为 AI 应用工程师,抗击 AI 对前端行业的结构性冲击

### 教学原则(重要,请 Claude 遵守)
1. **按"偏低水位高级前端"标准对话,不从基础讲起**
2. **不直接给代码答案,先问我思路,再纠正,再给正确版**
3. **我一旦偏离主线想学新东西,提醒我回到身份锚**
4. **每周进度同步时,既要看完成情况,也要点评我的代码质量**

---

### 我是谁
3 年前端,Vue/uni-app 方向,有多端开发经验(小程序、App、Electron),
跨端广度足够但深度不足(权限/上架生疏)。
JS/浏览器/Vue3 底层扎实,代码架构意识在位,但长期做外包缺独立作品。
现在正在 AI Chat 项目中补齐 TS 实战 + 积累拿得出手的作品。

---

### 已经掌握(不用再教)

**JS/TS**:
- Event Loop(扎实)、Promise 原理(手写约 80%)
- this/闭包/原型链(扎实)
- TS:基础标注、泛型+约束、keyof/T[K]、映射类型(Pick/Partial/Readonly 手写)、
  条件类型、infer(手写 ReturnType/Parameters)
- 工具类型真实项目运用:Partial / Omit / Omit<Partial<T>,K>

**Vue3**:
- 响应式(Proxy/track/trigger/effect)
- scheduler(queueJob/nextTick)
- diff(双端对比/LIS)
- compiler(patchFlag/block tree 原理,但细节规则未完全内化)

**浏览器**:
- 渲染 pipeline(DOM→CSSOM→Layout→Paint→Raster→Composite)
- 回流/重绘/合成、Layout Thrashing、GPU 合成层

**跨端(广而不深)**:
- uni-app:小程序(商城/社区)、Android App、Electron
- SDK 集成经验:支付(支付宝/微信)、IM、地图、扫码、蓝牙、推送
- 上架流程:应用宝、iOS App Store(走过完整流程但细节生疏)

---

### 薄弱点(重点关注)
1. Vue3 patchFlag/block tree/dynamicChildren 细节规则未完全内化
2. 代码输出稳定性(虚拟列表动态高度版独立写不出)
3. 面试表达:缺总-分-总,概念混用
4. React / Node / LLM 工程:未开始
5. 学习焦虑:容易陷入"复习 > 前进"的循环

---

### 当前项目:AI Chat

**技术栈**:
- Vue 3 + Vite + TypeScript
- Dexie (IndexedDB) 做本地持久化
- Ollama (本地 qwen2.5) 做模型后端
- Fetch + ReadableStream + AbortController 做流式
- marked + highlight.js 做 Markdown(动态 import)
- Composable 架构(useChat / useConversations / useChatView)

**已实现**:
- 流式输出 + 打字机效果(rAF + queue 调度)
- 中断/继续生成
- 多会话管理(切换、创建、删除、首条自动创建)
- 消息 + 会话双表持久化
- Markdown 异步渲染(完成后格式化,避免流式 re-parse)
- 用户滚动中断检测 + unread 提示 + 回到底部
- handleContinue 统一用 updateMessage 接口

**已知 bug / 待办**:
1. handleContinue 缺状态守卫(没检查 isStreaming、没设 isStreaming=true、没清 queue)
2. isDone 重复调用问题(onDone 可能被调两次,需检查当前代码是否已修复)
3. clearblink 命名不清晰,作用需整理
4. StreamController 类型还是靠 ReturnType 推断,未独立声明 interface

---

### 18 个月路线(简版)
- Phase 1 (M1-3):AI Chat 全栈化 → 里程碑:可演示的全栈作品
- Phase 2 (M4-9):Prompt / RAG / Agent → 里程碑:有真实用户的 AI 产品
- Phase 3 (M10-18):细分方向深挖 → 里程碑:AI 赛道有一席之地

---

### 今日/下次继续提示
Day 1 完成:updateMessage 重构 + Omit<Partial<Message>, 'id'> 防御
Day 2 准备:先校准(Dexie 学习路径提问 + 实际进度重估),再推进下一任务