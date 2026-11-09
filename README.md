# Snake Web · 贪吃蛇

一个无需框架、后端、用户账号或 API Key 的 HTML5 Canvas 贪吃蛇小游戏。游戏规则独立封装在 `js/utils.js`，可以用 Node 内置测试运行器验证。

## 运行

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000/
```

直接打开 `index.html` 通常也可以运行，但本地 HTTP 服务更接近 Pages 环境。

- 点击 **开始**；使用方向键或 WASD 转弯。手机可滑动棋盘或点按方向按钮。
- **空格** 暂停/继续；**R** 或“重新开始”重置分数和状态。
- 每吃一个食物加 10 分，食物不会生成到蛇身。撞墙/撞自己结束；占满棋盘获胜。
- 一帧最多执行一次转向，不允许直接掉头；向刚腾空的尾格移动是合法的。

## 测试

```bash
node --test tests/*.test.cjs
node --check js/utils.js
node --check js/snake.js
```

CI 自动测试纯规则与 JS 语法；**CI 不等于已完成真实浏览器端 E2E 验证**。

## 发布

仓库附带 `pages.yml`，在 `main` 推送后运行测试，并将纯静态文件上传 GitHub Pages。需要在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。成功部署后预计地址为 <https://1998x-stack.github.io/Snake_Web/>，但在 Pages 作业成功且真实浏览器核对前请勿标记“已验证在线可玩”。

## 结构

- `index.html`、`style.css`：页面、响应式与可访问的控制。
- `js/utils.js`：无 DOM 依赖的纯规则模块，负责食物、碰撞、转向、状态迁移。
- `js/snake.js`：Canvas 绘制、键盘/触控、唯一计时器。
- `tests/logic.test.cjs`：固定场景、终局、增长、尾格等规则测试。

独立重构仅涉及此仓库的代码，不复制第三方音视频素材。相关目录：[1998x-stack/games](https://github.com/1998x-stack/games)。
