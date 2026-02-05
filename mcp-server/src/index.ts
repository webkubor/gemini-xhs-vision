#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import fetch from "node-fetch";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from 'url';

// --- Configuration ---
const SERVER_NAME = "gemini-xhs-vision";
const SERVER_VERSION = "1.0.0";
const R2_UPLOAD_URL = process.env.R2_UPLOAD_URL || "https://r2-upload-proxy.webkubor.workers.dev/";

// --- Aesthetic Presets ---
const XHS_AESTHETIC_PROMPT = `
Style: Xiaohongshu Aesthetic (Red aesthetic).
Skin: Porcelain-like, cold white tone (冷白皮), smooth, zero pores, soft focus.
Face: Youthful, collagen-rich, refined features.
Lighting: High-key soft lighting, diffused, flattering.
Vibe: High-end lifestyle, clean, minimal, effortless beauty.
`;

// --- Server Setup ---
const server = new Server(
  {
    name: SERVER_NAME,
    version: SERVER_VERSION,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// --- Tool Definitions ---
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
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
            mood: {
              type: "string",
              description: "Optional mood override (e.g., cozy, luxury).",
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
  if (request.params.name === "generate_xhs_image") {
    const { prompt, mood = "lifestyle" } = request.params.arguments as any;

    try {
        // 1. Construct the Enhanced Prompt
        const fullPrompt = `${XHS_AESTHETIC_PROMPT}
Mood: ${mood}
Subject: ${prompt}

(High Resolution, Photorealistic, 8k)`;

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

(To fully functionalize this, we need to embed the Google GenAI SDK logic here, similar to Nanobanana)`
            }
            ]
        };

    } catch (error) {
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
