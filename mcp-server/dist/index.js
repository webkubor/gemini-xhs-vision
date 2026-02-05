#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from 'url';
import { getResolvedTemplate, loadTemplates } from "./templates.js";
import { pickRandom, XHS_OPTIONS } from "./xhs-options.js";
// --- Configuration ---
const SERVER_NAME = "gemini-xhs-vision";
const SERVER_VERSION = "1.0.0";
const R2_UPLOAD_URL = process.env.R2_UPLOAD_URL;
if (!R2_UPLOAD_URL || R2_UPLOAD_URL === "YOUR_UPLOAD_PROXY_URL") {
    console.error("[Warning] R2_UPLOAD_URL is not configured. Images will only be saved locally.");
}
// --- Aesthetic Presets ---
const XHS_AESTHETIC_PROMPT = `
Style: Xiaohongshu Aesthetic (Red aesthetic).
Skin: Porcelain-like, cold white tone (冷白皮), smooth, zero pores, soft focus.
Face: Youthful, collagen-rich, refined features.
Lighting: High-key soft lighting, diffused, flattering.
Vibe: High-end lifestyle, clean, minimal, effortless beauty.
`;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EXTENSION_ROOT = path.resolve(__dirname, "..", "..");
// --- Server Setup ---
const server = new Server({
    name: SERVER_NAME,
    version: SERVER_VERSION,
}, {
    capabilities: {
        tools: {},
    },
});
// --- Tool Definitions ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "list_xhs_templates",
                description: "Lists available Xiaohongshu prompt templates (presets).",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "list_xhs_options",
                description: "Lists available attribute options (hair/outfit/background) used for random variation.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "generate_xhs_image",
                description: "Generates a Xiaohongshu-style aesthetic image and uploads it to cloud.",
                inputSchema: {
                    type: "object",
                    properties: {
                        prompt: {
                            type: "string",
                            description: "Description of the scene and subject.",
                        },
                        template: {
                            type: "string",
                            description: "Template preset name (e.g., lifestyle, elegant, candid, pure).",
                        },
                        randomize: {
                            type: "boolean",
                            description: "Whether to randomly vary unlocked attributes (hair style/outfit/background). Default true.",
                            default: true,
                        },
                        locks: {
                            type: "object",
                            description: "Lock certain attributes. Default locks: face=true, hair_color=true (others unlocked).",
                            properties: {
                                face: { type: "boolean" },
                                hair_style: { type: "boolean" },
                                hair_color: { type: "boolean" },
                                outfit: { type: "boolean" },
                                background: { type: "boolean" },
                            },
                        },
                        hair_style: {
                            type: "string",
                            description: "Explicit hair style (overrides randomization).",
                        },
                        hair_color: {
                            type: "string",
                            description: "Explicit hair color (overrides lock/default).",
                        },
                        outfit: {
                            type: "string",
                            description: "Explicit outfit/clothing description (overrides randomization).",
                        },
                        background: {
                            type: "string",
                            description: "Explicit background description (overrides randomization).",
                        },
                        mood: {
                            type: "string",
                            description: "Optional mood/template override (backward-compatible). Prefer `template` when using presets.",
                        },
                        aspect_ratio: {
                            type: "string",
                            description: "Aspect ratio, default 3:4.",
                            default: "3:4"
                        }
                    },
                    required: ["prompt"],
                },
            },
        ],
    };
});
// --- Tool Execution ---
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "list_xhs_options") {
        try {
            const lines = [
                "Available options (built-in pools):",
                ...Object.entries(XHS_OPTIONS).map(([key, values]) => `- ${key}: ${values.join(", ")}`),
                "",
                'Tip: In `generate_xhs_image`, pass `randomize=true` to pick from these pools, or set explicit fields like `hair_style`/`outfit`/`background`.',
            ];
            return { content: [{ type: "text", text: lines.join("\n") }] };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error listing options: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
    if (request.params.name === "list_xhs_templates") {
        try {
            const templates = await loadTemplates(EXTENSION_ROOT);
            const items = Array.from(templates.resolved.values())
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((t) => ({ name: t.name, label: t.label ?? t.name, aspect_ratio: t.aspect_ratio }));
            const source = templates.filePath ? `Loaded from: ${templates.filePath}` : "Loaded from: built-in fallback";
            return {
                content: [
                    {
                        type: "text",
                        text: `${source}\n\nAvailable templates:\n${items
                            .map((i) => `- ${i.name}${i.label && i.label !== i.name ? ` (${i.label})` : ""}${i.aspect_ratio ? ` [${i.aspect_ratio}]` : ""}`)
                            .join("\n")}`,
                    },
                ],
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error listing templates: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
    if (request.params.name === "generate_xhs_image") {
        const { prompt, template, mood, aspect_ratio, randomize = true, locks: rawLocks, hair_style, hair_color, outfit, background, } = request.params.arguments;
        try {
            const templates = await loadTemplates(EXTENSION_ROOT);
            const chosenName = (template ?? mood ?? templates.config.defaults?.template ?? "lifestyle");
            const resolvedTemplate = getResolvedTemplate(templates, chosenName);
            const locks = {
                face: true,
                hair_color: true,
                hair_style: false,
                outfit: false,
                background: false,
                ...(rawLocks ?? {}),
            };
            if (typeof hair_style === "string" && hair_style.trim())
                locks.hair_style = true;
            if (typeof hair_color === "string" && hair_color.trim())
                locks.hair_color = true;
            if (typeof outfit === "string" && outfit.trim())
                locks.outfit = true;
            if (typeof background === "string" && background.trim())
                locks.background = true;
            const pickedHairStyle = typeof hair_style === "string" && hair_style.trim()
                ? hair_style.trim()
                : randomize && !locks.hair_style
                    ? pickRandom(XHS_OPTIONS.hair_style)
                    : null;
            const pickedOutfit = typeof outfit === "string" && outfit.trim()
                ? outfit.trim()
                : randomize && !locks.outfit
                    ? pickRandom(XHS_OPTIONS.outfit)
                    : null;
            const pickedBackground = typeof background === "string" && background.trim()
                ? background.trim()
                : randomize && !locks.background
                    ? pickRandom(XHS_OPTIONS.background)
                    : null;
            const explicitHairColor = typeof hair_color === "string" && hair_color.trim() ? hair_color.trim() : null;
            const lockLines = [];
            if (locks.face)
                lockLines.push("Identity: locked (keep face/facial features consistent; no identity change).");
            if (locks.hair_color && !explicitHairColor)
                lockLines.push("Hair color: locked (keep consistent; do not change).");
            if (locks.hair_style && !pickedHairStyle)
                lockLines.push("Hair style: locked (keep consistent; do not change).");
            if (locks.outfit && !pickedOutfit)
                lockLines.push("Outfit: locked (keep consistent; do not change).");
            if (locks.background && !pickedBackground)
                lockLines.push("Background: locked (keep consistent; do not change).");
            const attributeLines = [];
            if (explicitHairColor)
                attributeLines.push(`Hair color: ${explicitHairColor}`);
            if (pickedHairStyle)
                attributeLines.push(`Hair style: ${pickedHairStyle}`);
            if (pickedOutfit)
                attributeLines.push(`Outfit: ${pickedOutfit}`);
            if (pickedBackground)
                attributeLines.push(`Background: ${pickedBackground}`);
            const templateBlock = resolvedTemplate?.prompt
                ? `Template: ${resolvedTemplate.name}\n${resolvedTemplate.prompt}`
                : `Mood: ${String(mood ?? template ?? chosenName)}`;
            const effectiveAspectRatio = aspect_ratio ??
                resolvedTemplate?.aspect_ratio ??
                templates.config.defaults?.aspect_ratio ??
                "3:4";
            // 1. Construct the Enhanced Prompt
            const fullPrompt = `${XHS_AESTHETIC_PROMPT}
${templateBlock}
Subject: ${prompt}
${lockLines.length ? `\nLocks:\n- ${lockLines.join("\n- ")}` : ""}
${attributeLines.length ? `\nAttributes:\n- ${attributeLines.join("\n- ")}` : ""}
Aspect Ratio: ${effectiveAspectRatio}

(High Resolution, Photorealistic, 8k)
${resolvedTemplate?.negative ? `\nNegative: ${resolvedTemplate.negative}` : ""}`.trim();
            // 2. Mocking Image Generation for Prototype (In real extension, this calls Google GenAI)
            // Since we are running as a sub-process, we cannot easily call back to the main Gemini process.
            // For this standalone extension to work, it would need the Google GenAI SDK directly.
            // BUT, since we want to mimic your current workflow, we will simulate the flow or print instructions.
            // *IMPORTANT*: In a real standalone extension, we would use the @google/genai SDK here.
            // For this prototype to be valid, I will return a text response instructing how it WOULD work,
            // or we can implement the actual API call if you provide an API Key.
            // Let's assume we want to integrate with your existing 'generate_image' tool.
            // MCP tools cannot call OTHER MCP tools directly easily.
            // So this tool effectively acts as a "Prompt Engineer" + "Uploader".
            // Strategy: Return the OPTIMIZED Prompt to the Agent, and let the Agent call the image generation?
            // NO, tools should do the work.
            // For this demo, I will return the Optimized Prompt so you can see it.
            // In the full version, we add `imageGenerator.ts` from nanobanana.
            return {
                content: [
                    {
                        type: "text",
                        text: `[XHS-Vision] Enhanced Prompt Prepared:

${fullPrompt}

(Template source: ${templates.filePath ?? "built-in fallback"})

(To fully functionalize this, we need to embed the Google GenAI SDK logic here, similar to Nanobanana)`
                    }
                ]
            };
        }
        catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error generating image: ${error instanceof Error ? error.message : String(error)}`,
                    },
                ],
                isError: true,
            };
        }
    }
    throw new Error(`Tool ${request.params.name} not found`);
});
// --- Start Server ---
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map