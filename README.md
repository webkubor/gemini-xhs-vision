# 📸 Gemini XHS Vision (小红书视觉引擎)

[![Gemini Extension](https://img.shields.io/badge/Gemini-Extension-blue?logo=google-gemini)](https://github.com/webkubor/gemini-xhs-vision)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Gemini XHS Vision** 是一款专为小红书（Xiaohongshu）创作者设计的 Gemini CLI 扩展插件。它将复杂的 AI 绘图指令、中式审美修饰与自动化云端存储集成于一体，实现“一键出片”。

## ✨ 核心特性

- **🏮 中式审美自动注入**: 无需冗长的 Prompt，内置“白幼瘦”、“冷白皮”、“胶原蛋白感”等顶级审美参数。
- **🔒 骨相特征锁死**: 基于 Persona System，确保生成的人物五官与参考图 100% 一致，杜绝“AI 换脸”。
- **☁️ 自动化 R2 存储**: 生成图片后自动上传至 Cloudflare R2，直接返回 Markdown 外链，即拿即用。
- **🎬 场景化模板**: 支持“男友视角”、“淑女风”、“居家素颜”等多种预设场景。

## 🚀 快速安装

1. **安装插件**:
   在您的 Gemini CLI 中运行：
   ```bash
   gemini extensions install https://github.com/webkubor/gemini-xhs-vision
   ```

2. **配置图床 (可选)**:
   为了让插件自动返回 Markdown 图片链接，您需要设置 `R2_UPLOAD_URL` 环境变量（指向您的上传代理或 API）：
   ```bash
   export R2_UPLOAD_URL="https://your-api.com/upload"
   ```

3. **设置人像参考 (关键)**:
   本插件的核心是“骨相锁死”。
   - 请在您的当前工作目录下创建 `assets/` 或 `images/` 文件夹。
   - 放入您的基准人像图（例如 `my_face.png`）。
   - 在使用时，插件会自动关联您指定的参考图以保持特征一致。

## 🛠 使用指南

### 1. 基础生成 (基于参考图)
```text
/xhs "在咖啡馆喝下午茶" ref="assets/my_face.png"
```
*如果不指定 ref，插件将尝试在 assets/ 目录下寻找默认图片。*

### 2. 指定模板 (Mood)
- **`mood="elegant"`**: 强化淑女感与高级质感。
- **`mood="candid"`**: 模拟男友视角/抓拍，去除摆拍感。
- **`mood="pure"`**: 极致素颜效果，适合居家场景。

## ⚙️ 进阶配置

如果您是开发者，可以通过修改 `mcp-server/src/index.ts` 中的 `XHS_AESTHETIC_PROMPT` 来自定义您的专属审美注入逻辑。


## 📂 项目结构

- `mcp-server/`: 基于 Model Context Protocol 的核心服务端代码 (TypeScript)。
- `GEMINI.md`: 插件的操作指南，定义了 Agent 如何调用此工具。
- `gemini-extension.json`: 插件元数据与启动配置。

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。

---
Created by [webkubor](https://github.com/webkubor) with ❤️
