# 📸 Gemini XHS Vision (Xiaohongshu Visual Engine)

[English](README.md) · [Chinese](README.zh-CN.md)

[![Gemini Extension](https://img.shields.io/badge/Gemini-Extension-blue?logo=google-gemini)](https://github.com/webkubor/gemini-xhs-vision)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Gemini XHS Vision** is a Gemini CLI extension built for Xiaohongshu (Little Red Book) creators. It packages Chinese-aesthetic prompt styling, persona consistency controls, and optional cloud upload into a one-command workflow.

## ✨ Key Features

- **Chinese-aesthetic prompt injection**: High-quality Xiaohongshu-style lighting/skin/vibe guidance without writing long prompts.
- **Template presets (Template)**: Switch style presets via `template="..."`, with inheritance + custom template files.
- **Locks + random variation**: Default locks **face + hair color**, while hair style/outfit/background can vary.
- **Discoverability**: List available templates and built-in variation pools.
- **Optional auto-upload**: Configure `R2_UPLOAD_URL` (e.g., Cloudflare R2 upload proxy) for Markdown image links.

## 🖼️ Examples

| Example 1 | Example 2 | Example 3 |
| --- | --- | --- |
| <a href="./1.png"><img src="./1.png" alt="Gemini XHS Vision example 1" width="240" /></a> | <a href="./2.png"><img src="./2.png" alt="Gemini XHS Vision example 2" width="240" /></a> | <a href="./3.jpg"><img src="./3.jpg" alt="Gemini XHS Vision example 3" width="240" /></a> |

## 🚀 Quick Install

1. **Install the extension**:
   Run in Gemini CLI:
   ```bash
   gemini extensions install https://github.com/webkubor/gemini-xhs-vision
   ```

2. **Configure image upload (optional)**:
   To return Markdown image links automatically, set `R2_UPLOAD_URL` (your upload proxy/API):
   ```bash
   export R2_UPLOAD_URL="https://your-api.com/upload"
   ```

3. **Set a reference portrait (recommended)**:
   - Create `assets/` or `images/` in your working directory.
   - Put a baseline portrait image there (e.g., `assets/my_face.png`).
   - Use it as `ref="assets/my_face.png"` to keep identity consistent.

## 🛠 Usage

### 1) Basic generation (with reference)
```text
/xhs "Having afternoon tea at a cafe" ref="assets/my_face.png"
```
If `ref` is not provided, the agent rules typically try `./assets/` or `./images/` (depending on your setup).

### 2) Pick a template preset (Template)
- **`template="elegant"`**: Elegant / refined.
- **`template="candid"`**: “Boyfriend POV” candid snapshot vibe.
- **`template="pure"`**: Barely-there makeup / cozy home vibe.
- **`template="wuxia"`**: Chinese Wuxia / Jianghu vibe (Hanfu, bamboo, mist, cinematic).

The default templates file is `templates/xhs-templates.json`. You can override it via `XHS_TEMPLATES_PATH`.

### 3) Locks + random variation
Default behavior: lock **face + hair color**, while hair style/outfit/background can vary.

```text
/xhs "Browsing magazines at a bookstore" template="candid"
```

To fully specify attributes (no randomization):
```text
/xhs "Coffee by the floor-to-ceiling window" template="elegant" randomize=false hair_style="low ponytail" outfit="black blazer" background="cafe interior, warm light"
```

## ⚙️ Templates & options

### Custom templates

- Default: `templates/xhs-templates.json`
- Override via env:

```bash
export XHS_TEMPLATES_PATH="/abs/path/to/your-templates.json"
```

### List templates and variation pools

- Use `list_xhs_templates` to list presets.
- Use `list_xhs_options` to list built-in variation pools.

## 📂 Project Structure

- `mcp-server/`: MCP (Model Context Protocol) server (TypeScript).
- `templates/`: Template presets (JSON).
- `GEMINI.md`: Agent usage rules for this extension.
- `gemini-extension.json`: Extension metadata and startup config.

## 📜 License

Released under the [MIT License](LICENSE).

---
Created by [webkubor](https://github.com/webkubor) with ❤️
