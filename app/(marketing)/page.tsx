import fs from "node:fs";
import path from "node:path";

import { ZolHomepage } from "@/features/landing";

/**
 * Drop a shop photograph into `public/` under one of these names and the hero
 * swaps the board panel for it on the next build -- no code change needed.
 * Landscape, roughly 3:2, subject weighted right: the emerald diagonal clips
 * the left ~11% of that panel.
 */
const HERO_IMAGE_NAMES = [
  "hero-shop.jpg",
  "hero-shop.jpeg",
  "hero-shop.png",
  "hero-shop.webp",
  "hero-shop.avif",
];

function findHeroImage(): string | null {
  for (const name of HERO_IMAGE_NAMES) {
    if (fs.existsSync(path.join(process.cwd(), "public", name))) {
      return `/${name}`;
    }
  }
  return null;
}

export default function MarketingPage() {
  return <ZolHomepage heroImage={findHeroImage()} />;
}
