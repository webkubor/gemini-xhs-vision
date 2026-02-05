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
    *   `mood` (string): Optional mood (e.g., "cozy", "luxury", "street").
    *   `aspect_ratio` (string): Default is "3:4" (Portrait) for mobile feed.

## Usage Rules

*   When user asks for "Xiaohongshu style" or uses `/xhs`, ALWAYS use `generate_xhs_image`.
*   The tool handles the prompt enhancement internally; do not manually add "best quality" etc.
*   Always display the returned image URL as a Markdown image: `![Image](url)`.
