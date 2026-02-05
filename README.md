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

在您的 Gemini CLI 中运行：

```bash
gemini extensions install https://github.com/webkubor/gemini-xhs-vision
```

## 🛠 使用指南

### 1. 基础生成
```text
/xhs "一位穿着白色羽绒服的女生在雪地里"
```

### 2. 指定心情
```text
/xhs "在图书馆看书" mood="elegant"
```

### 3. 男友视角 (POV)
```text
/xhs "递给我一杯咖啡" mood="candid"
```

## 📂 项目结构

- `mcp-server/`: 基于 Model Context Protocol 的核心服务端代码 (TypeScript)。
- `GEMINI.md`: 插件的操作指南，定义了 Agent 如何调用此工具。
- `gemini-extension.json`: 插件元数据与启动配置。

## 📜 许可证

本项目采用 [MIT License](LICENSE) 开源。

---
Created by [webkubor](https://github.com/webkubor) with ❤️
