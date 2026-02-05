# 📸 Gemini XHS Vision (小红书视觉引擎)

[English](README.md) · [中文文档](README.zh-CN.md)

[![Gemini Extension](https://img.shields.io/badge/Gemini-Extension-blue?logo=google-gemini)](https://github.com/webkubor/gemini-xhs-vision)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**EN**: **Gemini XHS Vision** is a Gemini CLI extension built for Xiaohongshu creators. It packages Chinese-aesthetic prompt styling, persona consistency controls, and optional cloud upload into a one-command workflow.

**中文**：**Gemini XHS Vision** 是一款专为小红书（Xiaohongshu）创作者设计的 Gemini CLI 扩展插件。它将中式审美 Prompt 模板、人物一致性控制与（可选的）自动化云端存储集成于一体，实现“一键出片”。

## ✨ 核心特性

- **🏮 中式审美自动注入**: 无需冗长的 Prompt，内置“白幼瘦”、“冷白皮”、“胶原蛋白感”等顶级审美参数。
- **🔒 骨相特征锁死**: 基于 Persona System，确保生成的人物五官与参考图 100% 一致，杜绝“AI 换脸”。
- **☁️ 自动化 R2 存储**: 生成图片后自动上传至 Cloudflare R2，直接返回 Markdown 外链，即拿即用。
- **🎬 场景化模板**: 支持“男友视角”、“淑女风”、“居家素颜”等多种预设场景。

## 🖼️ 实例效果

| 示例 1 | 示例 2 | 示例 3 |
| --- | --- | --- |
| <a href="./1.png"><img src="./1.png" alt="Gemini XHS Vision 示例 1" width="240" /></a> | <a href="./2.png"><img src="./2.png" alt="Gemini XHS Vision 示例 2" width="240" /></a> | <a href="./3.jpg"><img src="./3.jpg" alt="Gemini XHS Vision 示例 3" width="240" /></a> |

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

### 2. 指定模板 (Template)
- **`template="elegant"`**: 强化淑女感与高级质感。
- **`template="candid"`**: 模拟男友视角/抓拍，去除摆拍感。
- **`template="pure"`**: 极致素颜效果，适合居家场景。
- **`template="wuxia"`**: 中式武侠风 / 江湖感（汉服、竹林、烟雨氛围、电影感）。

默认模板文件位于 `templates/xhs-templates.json`，也支持通过 `XHS_TEMPLATES_PATH` 指向你自己的模板文件。

### 3. 锁定/随机变化 (Locks + Randomize)
默认行为：**锁定脸 + 发色**，其余（发型/衣服/背景）可随机变化。

```text
/xhs "在书店挑选杂志" template="candid"
```

如果你想完全手动指定（不随机）：
```text
/xhs "在落地窗边喝咖啡" template="elegant" randomize=false hair_style="low ponytail" outfit="black blazer" background="cafe interior, warm light"
```

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
