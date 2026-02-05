import fs from "fs-extra";
import path from "path";
import { z } from "zod";
const TemplateSchema = z.object({
    label: z.string().optional(),
    extends: z.string().optional(),
    prompt: z.string().optional(),
    negative: z.string().optional(),
    aspect_ratio: z.string().optional(),
});
const TemplatesFileSchema = z.object({
    version: z.number().int().optional(),
    defaults: z
        .object({
        template: z.string().optional(),
        aspect_ratio: z.string().optional(),
    })
        .optional(),
    templates: z.record(z.string(), TemplateSchema),
});
let cache = null;
function safeParseTemplatesFile(raw) {
    const parsed = TemplatesFileSchema.safeParse(raw);
    if (!parsed.success) {
        const message = parsed.error.issues.map((i) => i.message).join("; ");
        throw new Error(`Invalid templates file: ${message}`);
    }
    return parsed.data;
}
function resolveTemplate(name, templates, stack, memo) {
    const existing = memo.get(name);
    if (existing)
        return existing;
    const current = templates[name];
    if (!current) {
        throw new Error(`Unknown template: ${name}`);
    }
    if (stack.includes(name)) {
        throw new Error(`Template extends cycle: ${[...stack, name].join(" -> ")}`);
    }
    const nextStack = [...stack, name];
    const base = current.extends ? resolveTemplate(current.extends, templates, nextStack, memo) : null;
    const resolved = {
        name,
        label: current.label ?? base?.label,
        prompt: [base?.prompt, current.prompt].filter(Boolean).join("\n").trim() || undefined,
        negative: [base?.negative, current.negative].filter(Boolean).join("\n").trim() || undefined,
        aspect_ratio: current.aspect_ratio ?? base?.aspect_ratio,
    };
    memo.set(name, resolved);
    return resolved;
}
function resolveAll(config) {
    const memo = new Map();
    for (const name of Object.keys(config.templates)) {
        resolveTemplate(name, config.templates, [], memo);
    }
    return memo;
}
async function tryLoadFromFile(filePath) {
    const stat = await fs.stat(filePath);
    const raw = await fs.readJson(filePath);
    return { config: safeParseTemplatesFile(raw), mtimeMs: stat.mtimeMs };
}
function defaultTemplatesFilePath(extensionRoot) {
    return path.resolve(extensionRoot, "templates", "xhs-templates.json");
}
function candidatePaths(extensionRoot) {
    const envPath = process.env.XHS_TEMPLATES_PATH?.trim();
    const cwd = process.cwd();
    const candidates = [
        envPath ? path.resolve(envPath) : null,
        path.resolve(cwd, "xhs-templates.json"),
        path.resolve(cwd, "xhs-vision.templates.json"),
        path.resolve(cwd, ".xhs-templates.json"),
        path.resolve(cwd, "templates", "xhs-templates.json"),
        defaultTemplatesFilePath(extensionRoot),
    ].filter((p) => Boolean(p));
    return Array.from(new Set(candidates));
}
export async function loadTemplates(extensionRoot) {
    const candidates = candidatePaths(extensionRoot);
    for (const filePath of candidates) {
        try {
            const { config, mtimeMs } = await tryLoadFromFile(filePath);
            if (cache && cache.filePath === filePath && cache.mtimeMs === mtimeMs) {
                return cache;
            }
            cache = {
                filePath,
                mtimeMs,
                config,
                resolved: resolveAll(config),
            };
            return cache;
        }
        catch {
            // ignore and continue
        }
    }
    const fallback = {
        version: 1,
        defaults: { template: "lifestyle", aspect_ratio: "3:4" },
        templates: {
            lifestyle: {
                label: "Lifestyle",
                prompt: "Vibe: High-end lifestyle, clean, minimal, effortless beauty.",
            },
        },
    };
    cache = {
        filePath: null,
        mtimeMs: null,
        config: fallback,
        resolved: resolveAll(fallback),
    };
    return cache;
}
export function getResolvedTemplate(templates, name) {
    return templates.resolved.get(name) ?? null;
}
//# sourceMappingURL=templates.js.map