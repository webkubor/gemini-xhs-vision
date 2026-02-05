import { z } from "zod";
declare const TemplateSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    extends: z.ZodOptional<z.ZodString>;
    prompt: z.ZodOptional<z.ZodString>;
    negative: z.ZodOptional<z.ZodString>;
    aspect_ratio: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const TemplatesFileSchema: z.ZodObject<{
    version: z.ZodOptional<z.ZodNumber>;
    defaults: z.ZodOptional<z.ZodObject<{
        template: z.ZodOptional<z.ZodString>;
        aspect_ratio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    templates: z.ZodRecord<z.ZodString, z.ZodObject<{
        label: z.ZodOptional<z.ZodString>;
        extends: z.ZodOptional<z.ZodString>;
        prompt: z.ZodOptional<z.ZodString>;
        negative: z.ZodOptional<z.ZodString>;
        aspect_ratio: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type TemplatesFile = z.infer<typeof TemplatesFileSchema>;
export type Template = z.infer<typeof TemplateSchema>;
type ResolvedTemplate = Omit<Template, "extends"> & {
    name: string;
};
type CachedTemplates = {
    filePath: string | null;
    mtimeMs: number | null;
    config: TemplatesFile;
    resolved: Map<string, ResolvedTemplate>;
};
export declare function loadTemplates(extensionRoot: string): Promise<CachedTemplates>;
export declare function getResolvedTemplate(templates: CachedTemplates, name: string): ResolvedTemplate | null;
export {};
//# sourceMappingURL=templates.d.ts.map