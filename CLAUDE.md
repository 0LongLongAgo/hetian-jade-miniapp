# CLAUDE.md — 独作 · 和田玉DIY（微信小程序）

## 项目结构

```
hetian-jade-miniapp/
├── app.js / app.json / app.wxss       # 全局入口
├── utils/api.js                       # 中央 API 层（请求+本地回退）
├── utils/data.js                      # 数据（珠子、设计图、色系）
├── components/name-modal/             # 命名弹窗组件
├── pages/index/                       # 首页（4宫格入口）
├── pages/bracelet/                    # 手链设计（核心页面，WXML渲染）
├── pages/bracelet-3d/                 # 3D预览（WebGL，开发中）
├── pages/jade-material/               # 玉牌料子选择
├── pages/design-gallery/              # 设计图选择
├── pages/jade-result/                 # 玉牌效果结果
├── pages/browse/                      # 逛逛好物（珠子浏览+分类筛选）
├── pages/square/                      # 设计广场
├── pages/square-detail/               # 设计详情+评论
└── pages/profile/                     # 我的设计
```

## 技术栈
- **平台**: 微信小程序 (libVersion 3.6.0)
- **Tab缩进**: 2空格
- **ES6**: 已开启
- **Canvas**: 2D API（bracelet页）+ WebGL（bracelet-3d页，预留）
- **存储**: wx.Storage（本地），无后端/无云开发
- **全局数据**: app.globalData（珠子、玉牌料子、设计图选择）

## 代码编写规范

1. 所有函数method写在Page/Component对象中，使用对象方法简写（不用`function`关键字）
2. 变量统一用 `const`（不变）或 `let`（可变），禁用 `var`
3. 命名：驼峰命名 `braceletSize`，事件处理用 `onXxx`
4. CSS变量统一从 `app.wxss` 的 `page {}` 中引用（`--purple`, `--gold` 等）
5. WXML 数据绑定：`{{}}` 中间不加空格
6. 避免在 WXML 中写复杂表达式，逻辑放 JS 中处理
7. 重复样式用 `app.wxss` 的全局类（`.btn`, `.card`, `.tag`, `.empty`, `.modal-mask`, `.modal-box` 等）

## 自测要求
每次代码修改后：
1. 检查所有 `setData` 的 key 是否在 `data` 中定义
2. 检查 WXML 中 `wx:for` 的 `wx:key` 是否存在
3. 检查 `require` 路径是否正确
4. 检查所有 bind 事件在 JS 中是否实现
5. 如果 Canvas 相关，确认 Canvas 2D API 的初始化流程

## 已知问题
- `design-gallery.js` 进度条是假的（setInterval模拟）
- `bracelet-3d.js` 是占位代码（WebGL初始化但模型加载待实现）
- Canvas 初始化无限重试，没有最大重试次数
- 后端/API 层完全缺失（当前使用 wx.Storage 回退）
- 所有图片 URL 为空（待后端上传）
