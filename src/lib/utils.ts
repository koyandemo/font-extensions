import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const DISABLED_DOMAINS = [
  "mmfontshub.app",
];

export const DEFAULT_STYLE = "normal";

export const STYLE_ID = "fc-custom-font-style";
export const FONT_FACE_ID = "fc-custom-font-faces";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STORAGE_KEYS = {
  id: "fontId",
  family: "fontFamily",
  style: "fontStyle",
};

export const FONT_CONFIG = [
  {
    id: "1",
    name: "Myanmar Jojar Pro",
    family: "Myanmar1",
    url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/T5GR7jypcWO7zrY02n6zXHN46bqBQsZI/ABrush/AkkhayarBrush-Regular.woff2",
    preview: "ဖောင့် နမူနာ စာသားများ",
  },
  {
    id: "2",
    name: "Myanmar Koz",
    family: "Myanmar2",
    url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/k0zwZFlUTtg2DOb2OFGoVERr1O5d1RLP/MyanmarJojarPro/MyanmarJojarPro-Regular.ttf",
    preview: "ဖောင့် နမူနာ စာသားများ Myanmar Koz",
  },
  {
    id: "3",
    name: "Myanmar Waso",
    family: "Myanmar3",
    url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/JRAoUmxfLBEi6t6953Q40l4pAUos67IU/free/koz032/SemiBold.woff2",
    preview: "ဖောင့် နမူနာ စာသားများ Myanmar Waso",
  },
  {
    id: "5",
    name: "Arial",
    family: "Arial",
    url: null,
    preview: "Font Sample Text",
  },
];

export const FONT_STYLES = [
  { label: "Normal", value: "normal" },
  { label: "Bold", value: "bold" },
  { label: "Italic", value: "italic" },
  { label: "Bold Italic", value: "bold-italic" },
];
