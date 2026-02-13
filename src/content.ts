import { DISABLED_DOMAINS, FONT_CONFIG } from "./lib/utils";

const STYLE_ID = "custom-font-style";
const FONT_FACE_ID = "custom-font-faces";

function removeFontStyle(): void {
  const styleEl = document.getElementById(STYLE_ID);
  if (styleEl) {
    styleEl.remove();
  }
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

  const rules = FONT_CONFIG
    .filter((font) => font.url)
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

function applyFontSettings(): void {
  if (isDisabledDomain()) return;

  chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
    const family = result.fontFamily;
    const styleValue = result.fontStyle;

    // 🚨 RESET CASE (no font selected OR Arial)
    if (!family || family === "Arial") {
      removeFontStyle();
      return;
    }

    let fontWeight = "normal";
    let fontStyleCSS = "normal";

    if (styleValue === "bold") {
      fontWeight = "bold";
    } else if (styleValue === "italic") {
      fontStyleCSS = "italic";
    } else if (styleValue === "bold-italic") {
      fontWeight = "bold";
      fontStyleCSS = "italic";
    }

    let styleEl = document.getElementById(STYLE_ID);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `
      * {
        font-family: '${family}', sans-serif !important;
        font-weight: ${fontWeight} !important;
        font-style: ${fontStyleCSS} !important;
      }
    `;
  });
}

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
  if (area === "sync" && (changes.fontFamily || changes.fontStyle)) {
    applyFontSettings();
  }
});

/**
 * @old_version
 */
// import { DISABLED_DOMAINS } from "./lib/utils";

// const customFonts = [
//   {
//     name: "MyanmarJojarPro",
//     url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/k0zwZFlUTtg2DOb2OFGoVERr1O5d1RLP/MyanmarJojarPro/MyanmarJojarPro-Regular.ttf"
//   },
//   {
//     name: "MyanmarKoz",
//     url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/JRAoUmxfLBEi6t6953Q40l4pAUos67IU/koz001/koz001_regular.ttf"
//   },
//   {
//     name: "MyanmarWaso",
//     url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/JRAoUmxfLBEi6t6953Q40l4pAUos67IU/free/koz032/SemiBold.woff2"
//   }
// ];

// function isDisabledDomain(): boolean {
//   const host = window.location.hostname;
//   return DISABLED_DOMAINS.some(
//     (domain) => host === domain || host.endsWith("." + domain)
//   );
// }

// function loadCustomFonts(): void {
//   if (isDisabledDomain()) {
//     return;
//   }

//   const styleId = "custom-font-faces";
//   const existingStyle = document.getElementById(styleId);
//   if (existingStyle) {
//     return;
//   }

//   const style = document.createElement("style");
//   style.id = styleId;

//   let fontFaceRules = "";
//   for (let i = 0; i < customFonts.length; i++) {
//     const font = customFonts[i];
//     fontFaceRules += "@font-face { font-family: '" + font.name + "'; src: url('" + font.url + "'); font-weight: normal; font-style: normal; font-display: swap; } ";
//   }

//   style.textContent = fontFaceRules;

//   const head = document.head;
//   if (head) {
//     head.appendChild(style);
//   }
// }

// function applyFontSettings(): void {
//   if (isDisabledDomain()) {
//     return;
//   }

//   chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
//     if (!result.fontFamily && !result.fontStyle) {
//       return;
//     }

//     const family = result.fontFamily || "Arial";
//     const styleValue = result.fontStyle || "normal";

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

//     const styleId = "custom-font-style";
//     let styleEl = document.getElementById(styleId);

//     if (!styleEl) {
//       styleEl = document.createElement("style");
//       styleEl.id = styleId;
//       const head = document.head;
//       if (head) {
//         head.appendChild(styleEl);
//       }
//     }

//     const cssRules = "* { font-family: '" + family + "', sans-serif !important; font-weight: " + fontWeight + " !important; font-style: " + fontStyleCSS + " !important; }";

//     styleEl.textContent = cssRules;
//   });
// }

// let applyTimeout: number | null = null;

// function observeDomChanges(): void {
//   const observer = new MutationObserver(() => {
//     if (applyTimeout) {
//       return;
//     }

//     applyTimeout = window.setTimeout(() => {
//       applyFontSettings();
//       applyTimeout = null;
//     }, 100);
//   });

//   observer.observe(document.documentElement, {
//     childList: true,
//     subtree: true
//   });
// }

// function initialize(): void {
//   if (isDisabledDomain()) {
//     return;
//   }

//   loadCustomFonts();

//   if (document.readyState === "loading") {
//     document.addEventListener("DOMContentLoaded", applyFontSettings);
//   } else {
//     applyFontSettings();
//   }

//   if (document.fonts) {
//     document.fonts.ready.then(() => {
//       applyFontSettings();
//     });
//   }

//   observeDomChanges();
// }

// initialize();

// chrome.storage.onChanged.addListener((changes, area) => {
//   if (area === "sync" && (changes.fontFamily || changes.fontStyle)) {
//     applyFontSettings();
//   }
// });
