# 📸 Gemini XHS Vision（小红书视觉引擎）中文文档

[English](README.md) · [中文文档](README.zh-CN.md)

**Gemini XHS Vision** 是一款专为小红书（Xiaohongshu）创作者设计的 Gemini CLI 扩展插件。它将中式审美 Prompt 模板、人物一致性（锁定）与（可选的）自动化云端存储集成在一个指令流里，帮助你更稳定地产出“可发的小红书风格图”。

## ✨ 核心特性

- **中式审美自动注入**：内置小红书审美的光影/肤质/氛围描述，减少你写 Prompt 的成本。
- **模板系统（Template）**：用 `template="..."` 一键切换风格预设，且支持继承与自定义模板文件。
- **锁定/随机变化（Locks + Randomize）**：默认锁定“脸 + 发色”，发型/衣服/背景可随机变化；也支持完全手动指定。
- **模板与选项可查询**：支持列出可用模板与内置随机池，方便用户探索。
- **可选自动上传**：可配置 `R2_UPLOAD_URL`（例如 Cloudflare R2 上传代理）用于自动生成图床链接。

## 🖼️ 实例效果

| 示例 1 | 示例 2 | 示例 3 |
| --- | --- | --- |
| <a href="./1.png"><img src="./1.png" alt="Gemini XHS Vision 示例 1" width="240" /></a> | <a href="./2.png"><img src="./2.png" alt="Gemini XHS Vision 示例 2" width="240" /></a> | <a href="./3.jpg"><img src="./3.jpg" alt="Gemini XHS Vision 示例 3" width="240" /></a> |

## 🚀 安装与更新

### 安装

在 Gemini CLI 中运行：

```bash
gemini extensions install https://github.com/webkubor/gemini-xhs-vision
```

### 更新

```bash
gemini extensions update xhs-vision
```

或更新所有扩展：

```bash
gemini extensions update --all
```

更新后建议重启当前 Gemini CLI 会话（扩展通常在启动时加载）。

## ⚙️ 配置

### 1) 配置图床（可选）

为了让插件自动返回 Markdown 图片链接，你需要设置 `R2_UPLOAD_URL`（指向你的上传代理或 API）：

```bash
export R2_UPLOAD_URL="https://your-api.com/upload"
```

> 未配置 `R2_UPLOAD_URL` 时，服务端会提示 Warning（目前该扩展仍以“生成 Prompt + 可扩展上传链路”为主）。

### 2) 设置人像参考（建议）

如果你希望人物一致性更强（“脸不变”），建议准备一张基准人像图：

- 在当前工作目录创建 `assets/` 或 `images/` 文件夹
- 放入基准人像图（例如 `assets/my_face.png`）

## 🛠 使用指南

### 1) 基础生成

```text
/xhs "在咖啡馆喝下午茶" ref="assets/my_face.png"
```

不指定 `ref` 时，Agent 规则会优先从 `./assets/` 或 `./images/` 寻找可用参考图（以你自己的使用习惯为准）。

### 2) 使用模板（Template）

```text
/xhs "在书店挑选杂志" template="candid"
```

常用模板示例：

- `template="elegant"`：淑女风 / 高级感
- `template="candid"`：男友视角 / 抓拍感
- `template="pure"`：极致素颜 / 居家感
- `template="wuxia"`：中式武侠风 / 江湖感（汉服、竹林、烟雨、电影感）

### 3) 锁定/随机变化（Locks + Randomize）

默认行为：

- `face=true`（锁定脸/人物身份：避免“换脸”）
- `hair_color=true`（锁定发色不变）
- `hair_style/outfit/background` 默认不锁定，可随机变化

一键默认随机（发型/衣服/背景可随机）：

```text
/xhs "雨天在窗边发呆" template="pure"
```

完全手动指定（不随机）：

```text
/xhs "在落地窗边喝咖啡" template="elegant" randomize=false hair_style="low ponytail" outfit="black blazer" background="cafe interior, warm light"
```

如果你想“全部锁住不变”（每次都尽量一致），可以传入 `locks`：

```text
/xhs "同一套造型的不同姿势" template="lifestyle" locks={"face":true,"hair_color":true,"hair_style":true,"outfit":true,"background":true}
```

> 说明：显式传入 `hair_style/hair_color/outfit/background` 时，会自动视为该字段已锁定。

## 🧩 模板与随机池

### 模板文件位置与覆盖规则

默认模板文件：`templates/xhs-templates.json`

你也可以用环境变量指定自己的模板文件路径：

```bash
export XHS_TEMPLATES_PATH="/abs/path/to/your-templates.json"
```

### 查看模板与随机池

- 列出模板：调用工具 `list_xhs_templates`
- 列出随机池：调用工具 `list_xhs_options`

（具体调用方式取决于你在 Gemini CLI 中如何触发工具；扩展的 Agent 规则在 `GEMINI.md` 里。）

## 📂 项目结构

- `mcp-server/`：基于 MCP 的服务端（TypeScript）
- `templates/`：模板配置（JSON）
- `GEMINI.md`：扩展的上下文/规则（告诉 Agent 如何使用工具）
- `gemini-extension.json`：扩展元数据与启动配置
- `CHANGELOG.md`：版本更新记录

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。

