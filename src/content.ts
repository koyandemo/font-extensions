import {
  DISABLED_DOMAINS,
  FONT_CONFIG,
  STORAGE_KEYS,
  DEFAULT_STYLE,
} from "./lib/utils";

const STYLE_ID = "fc-custom-style";
const FONT_FACE_ID = "fc-font-faces";


function removeFontStyle(): void {
  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) styleEl.remove();
}

function isDisabledDomain(): boolean {
  const host = window.location.hostname;
  return DISABLED_DOMAINS.some(
    (domain) => host === domain || host.endsWith("." + domain)
  );
}

function loadCustomFonts(): void {
  if (isDisabledDomain()) return;
  if (document.getElementById(FONT_FACE_ID)) return;

  const style = document.createElement("style");
  style.id = FONT_FACE_ID;

  const rules = FONT_CONFIG.filter((font) => font.url)
    .map(
      (font) => `
      @font-face {
        font-family: '${font.family}';
        src: url('${font.url}');
        font-display: swap;
      }
    `
    )
    .join("");

  style.textContent = rules;
  document.head.appendChild(style);
}

/**
 * Convert font style
 */
function getFontStyle(styleValue: string) {
  let fontWeight = "normal";
  let fontStyle = "normal";

  if (styleValue === "bold") fontWeight = "bold";
  else if (styleValue === "italic") fontStyle = "italic";
  else if (styleValue === "bold-italic") {
    fontWeight = "bold";
    fontStyle = "italic";
  }

  return { fontWeight, fontStyle };
}

/**
 * Convert font size → scale
 */
function getFontScale(size: string): number {
  switch (size) {
    case "small":
      return 0.85;
    case "large":
      return 1.15;
    case "medium":
    default:
      return 1;
  }
}

/**
 * Apply font + size
 */
function applyFontSettings(): void {
  if (isDisabledDomain()) return;

  chrome.storage.sync.get(
    [STORAGE_KEYS.family, STORAGE_KEYS.style, STORAGE_KEYS.size],
    (result) => {
      const family = result[STORAGE_KEYS.family];
      const styleValue = result[STORAGE_KEYS.style] || DEFAULT_STYLE;
      const sizeValue = result[STORAGE_KEYS.size] || "medium";

      if (!family || family === "Arial") {
        removeFontStyle();
        return;
      }

      const { fontWeight, fontStyle } = getFontStyle(styleValue as string);
      const scale = getFontScale(sizeValue as string);

      let styleEl = document.getElementById(STYLE_ID);

      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = STYLE_ID;
        document.head.appendChild(styleEl);
      }

      styleEl.textContent = `
        html {
          font-size: ${scale}em !important;
        }

        * {
          font-family: '${family}', sans-serif !important;
          font-weight: ${fontWeight} !important;
          font-style: ${fontStyle} !important;
        }
      `;
    }
  );
}

/**
 * Observe DOM changes (for SPA like React sites)
 */
let applyTimeout: number | null = null;

function observeDomChanges(): void {
  const observer = new MutationObserver(() => {
    if (applyTimeout) return;

    applyTimeout = window.setTimeout(() => {
      applyFontSettings();
      applyTimeout = null;
    }, 100);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}


function initialize(): void {
  if (isDisabledDomain()) return;

  loadCustomFonts();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFontSettings);
  } else {
    applyFontSettings();
  }

  document.fonts?.ready.then(() => {
    applyFontSettings();
  });

  observeDomChanges();
}

initialize();


chrome.storage.onChanged.addListener((changes, area) => {
  if (
    area === "sync" &&
    (changes[STORAGE_KEYS.family] ||
      changes[STORAGE_KEYS.style] ||
      changes[STORAGE_KEYS.size])
  ) {
    applyFontSettings();
  }
});



/**
 * @old_version
 */

// import { DISABLED_DOMAINS, FONT_CONFIG } from "./lib/utils";

// const STYLE_ID = "custom-font-style";
// const FONT_FACE_ID = "custom-font-faces";

// function removeFontStyle(): void {
//   const styleEl = document.getElementById(STYLE_ID);
//   if (styleEl) {
//     styleEl.remove();
//   }
// }

// function isDisabledDomain(): boolean {
//   const host = window.location.hostname;
//   return DISABLED_DOMAINS.some(
//     (domain) => host === domain || host.endsWith("." + domain)
//   );
// }

// function loadCustomFonts(): void {
//   if (isDisabledDomain()) return;
//   if (document.getElementById(FONT_FACE_ID)) return;

//   const style = document.createElement("style");
//   style.id = FONT_FACE_ID;

//   const rules = FONT_CONFIG
//     .filter((font) => font.url)
//     .map(
//       (font) => `
//       @font-face {
//         font-family: '${font.family}';
//         src: url('${font.url}');
//         font-display: swap;
//       }
//     `
//     )
//     .join("");

//   style.textContent = rules;
//   document.head.appendChild(style);
// }

// function applyFontSettings(): void {
//   if (isDisabledDomain()) return;

//   chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
//     const family = result.fontFamily;
//     const styleValue = result.fontStyle;

//     // 🚨 RESET CASE (no font selected OR Arial)
//     if (!family || family === "Arial") {
//       removeFontStyle();
//       return;
//     }

//     let fontWeight = "normal";
//     let fontStyleCSS = "normal";

//     if (styleValue === "bold") {
//       fontWeight = "bold";
//     } else if (styleValue === "italic") {
//       fontStyleCSS = "italic";
//     } else if (styleValue === "bold-italic") {
//       fontWeight = "bold";
//       fontStyleCSS = "italic";
//     }

//     let styleEl = document.getElementById(STYLE_ID);

//     if (!styleEl) {
//       styleEl = document.createElement("style");
//       styleEl.id = STYLE_ID;
//       document.head.appendChild(styleEl);
//     }

//     styleEl.textContent = `
//       * {
//         font-family: '${family}', sans-serif !important;
//         font-weight: ${fontWeight} !important;
//         font-style: ${fontStyleCSS} !important;
//       }
//     `;
//   });
// }

// let applyTimeout: number | null = null;

// function observeDomChanges(): void {
//   const observer = new MutationObserver(() => {
//     if (applyTimeout) return;

//     applyTimeout = window.setTimeout(() => {
//       applyFontSettings();
//       applyTimeout = null;
//     }, 100);
//   });

//   observer.observe(document.documentElement, {
//     childList: true,
//     subtree: true,
//   });
// }

// function initialize(): void {
//   if (isDisabledDomain()) return;

//   loadCustomFonts();

//   if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", applyFontSettings);
//   } else {
//     applyFontSettings();
//   }

//   document.fonts?.ready.then(() => {
//     applyFontSettings();
//   });

//   observeDomChanges();
// }

// initialize();

// chrome.storage.onChanged.addListener((changes, area) => {
//   if (area === "sync" && (changes.fontFamily || changes.fontStyle)) {
//     applyFontSettings();
//   }
// });
