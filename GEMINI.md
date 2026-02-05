# Gemini XHS Vision (小红书视觉引擎)

> **Description**: Automatic generation of high-quality, Chinese aesthetic (Xiaohongshu style) images with automated cloud uploading.
> **Trigger**: `/xhs`, "小红书", "generate xhs image".

## Core Features

1.  **Aesthetic Injection**: Automatically injects "Chinese Aesthetic" prompts (Cold White Skin, Porcelain Texture, Young, Collagen-rich) into every generation.
2.  **Identity Lock**: Supports "Persona System" to keep character consistency.
3.  **Auto-Upload**: Automatically uploads generated images to Cloudflare R2 and returns a markdown link.

## Tools

### `generate_xhs_image`
Generates an image optimized for Xiaohongshu aesthetics.

*   **Parameters**:
    *   `prompt` (string): The user's scene description.
    *   `ref_image` (string): Optional path to a reference image (default search in `assets/` or `images/`).
    *   `template` (string): Optional template preset name (e.g. `lifestyle`, `elegant`, `candid`, `pure`).
    *   `mood` (string): Backward-compatible override; prefer `template` when using presets.
    *   `aspect_ratio` (string): Default is "3:4" (can be overridden per template).
    *   `randomize` (boolean): Whether to randomly vary unlocked attributes (default true).
    *   `locks` (object): Lock switches (defaults: `face=true`, `hair_color=true`, others false).
    *   `hair_style` / `hair_color` / `outfit` / `background` (string): Explicit attribute overrides.

### `list_xhs_templates`
Lists available prompt templates (presets).

### `list_xhs_options`
Lists built-in option pools for random variation (hair/outfit/background).

## Usage Rules

*   When user asks for "Xiaohongshu style" or uses `/xhs`, ALWAYS use `generate_xhs_image`.
*   Search for reference images in `./assets/` or `./images/` if `ref_image` is not explicitly provided.
*   The tool handles the prompt enhancement internally.
*   Always display the returned image URL as a Markdown image: `![Image](url)`.
