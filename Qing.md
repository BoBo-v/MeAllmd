这是一个 Fastify 官方示例项目（任务管理 API），涵盖了后端开发的核心知识点。以下是为你定制的学习清单，由浅入深：
                                                                                                                                                                                                                                   
---                                                                                     
学习清单

阶段一：基础环境与项目启动

- 1. 了解项目全貌 — 阅读 package.json，了解项目用了哪些依赖，每个脚本命令是做什么的
- 2. 搭建运行环境 — 安装 Node.js、MySQL（或通过 docker-compose.yml 启动 Docker），复制 .env.example 为 .env 并填写配置
- 3. 跑起来 — 执行 npm run db:create → npm run db:migrate → npm run db:seed → npm run dev，浏览器打开 http://localhost:3000 和 http://localhost:3000/api/docs（Swagger 文档）

阶段二：理解项目结构

- 4. 入口文件 — 阅读 src/server.ts（启动入口）和 src/app.ts（应用组装），理解 Fastify 的插件加载顺序：外部插件 → 应用插件 → 路由
- 5. 插件机制 — 阅读 src/plugins/external/ 目录下的任意 2-3 个文件（推荐 env.ts、cors.ts、session.ts），理解 Fastify 插件是什么、怎么注册
- 6. 路由系统 — 从最简单的 src/routes/home.ts 开始，然后看 src/routes/api/index.ts，理解路由定义方式

阶段三：核心业务逻辑

- 7. 认证流程 — 阅读 src/routes/api/auth/index.ts（登录）和 src/routes/api/autohooks.ts（全局鉴权钩子），理解 session 认证的完整流程
- 8. CRUD 操作 — 阅读 src/routes/api/tasks/index.ts，这是项目最核心的文件，包含任务的增删改查、分页、文件上传/下载
- 9. 数据库层 — 阅读 src/plugins/app/tasks/tasks-repository.ts，理解 Knex.js 查询构建器的用法和 Repository 模式
- 10. 数据库迁移 — 阅读 migrations/ 目录下的 SQL 文件，理解版本化迁移（do/undo）的概念

阶段四：数据校验与类型

- 11. Schema 校验 — 阅读 src/schemas/tasks.ts 和 src/schemas/common.ts，理解 TypeBox 如何同时完成请求校验 + TypeScript 类型推导 + API 文档生成
- 12. TypeScript 基础 — 阅读 tsconfig.json，关注项目中类型是如何在 schema → route → repository 之间流动的

阶段五：安全与中间件

- 13. 密码安全 — 阅读 src/plugins/app/password-manager.ts，理解 scrypt 哈希 + 盐值 + 时间安全比较
- 14. 权限控制 (RBAC) — 阅读 src/plugins/app/authorization.ts，理解角色校验装饰器的实现
- 15. 安全插件 — 浏览 helmet.ts（安全头）、rate-limit.ts（限流）、under-pressure.ts（过载保护）

阶段六：文件处理

- 16. 文件上传 — 阅读 src/plugins/app/file-manager.ts 和 src/plugins/app/tasks/tasks-file-manager.ts，理解 multipart 上传 + 流式写入
- 17. CSV 导出 — 在 src/routes/api/tasks/index.ts 中找到下载路由，理解 csv-stringify + gzip 压缩流

阶段七：测试

- 18. 测试入门 — 阅读 test/helper.ts，理解测试辅助工具如何构建测试用 app 实例
- 19. 跑测试 — 执行 npm test，阅读 test/routes/ 下的测试文件，理解集成测试怎么写
- 20. 覆盖率 — 观察 c8 生成的覆盖率报告，理解哪些代码被测试覆盖了

阶段八：生产化

- 21. 优雅关闭 — 阅读 src/server.ts 中 closeWithGrace 的用法，理解为什么服务不能直接 kill
- 22. 构建与部署 — 执行 npm run build，查看 dist/ 目录产物，理解 TypeScript 编译流程

  ---
学习建议

1. 每个阶段先读代码，再用 Swagger UI 实际调用 API，把请求和代码对应起来
2. 不要跳阶段，前面的是后面的基础
3. 遇到不懂的依赖包，先看它的 npm 页面的一句话介绍就够了
4. 随时可以问我某个文件或概念的具体解释

按这个顺序走完，你会对 Node.js 后端开发有一个相当完整的理解。准备好了就从第 1 步开始吧！