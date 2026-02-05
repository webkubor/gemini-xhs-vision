export type XhsAttributeKey = "hair_style" | "hair_color" | "outfit" | "background";

export const XHS_OPTIONS: Record<XhsAttributeKey, string[]> = {
  hair_style: [
    "soft waves",
    "straight long hair",
    "short bob",
    "low ponytail",
    "messy bun",
    "curtain bangs",
  ],
  hair_color: ["natural black", "dark brown", "chestnut brown", "espresso", "soft black-brown"],
  outfit: [
    "white knit sweater",
    "beige trench coat",
    "black blazer",
    "cream cardigan",
    "simple white shirt",
    "soft-toned dress",
  ],
  background: [
    "cafe interior, warm light",
    "minimalist home, morning light",
    "city street, overcast soft light",
    "studio backdrop, clean neutral tone",
    "window side, soft daylight",
  ],
};

export function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)] as T;
}

