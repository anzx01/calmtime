export interface Wallpaper {
  id: string;
  label: string;
  premium: boolean;
}

export const WALLPAPERS: Wallpaper[] = [
  { id: "lake.gif",   label: "Mountain Lake", premium: false },
  { id: "sunset.gif", label: "Ocean Sunset",  premium: false },
  { id: "forest.gif", label: "Forest",        premium: false },
];

export function wallpaperUrl(id: string): string {
  return `/wallpapers/${id}`;
}
