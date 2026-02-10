import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const DISABLED_DOMAINS = ["mmfontshub.app"];

export const STORAGE_KEYS = {
  family: "fc_fontFamily",
  style: "fc_fontStyle",
};

  // System fonts
export const SYSTEM_FONTS = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Comic Sans MS",
  "Impact",
  "Trebuchet MS",
  "Palatino"
];

 
  // Custom Myanmar fonts
 export const CUSTOM_FONTS = [
    { name: "Myanmar Jojar Pro", value: "MyanmarJojarPro" },
    { name: "Myanmar Koz", value: "MyanmarKoz" },
    { name: "Myanmar Waso", value: "MyanmarWaso" }
  ];

export const FONT_STYLES = [
    { label: "Normal", value: "normal" },
    { label: "Bold", value: "bold" },
    { label: "Italic", value: "italic" },
    { label: "Bold Italic", value: "bold-italic" }
  ];