import { DISABLED_DOMAINS } from "./lib/utils";

const customFonts = [
  {
    name: "MyanmarJojarPro",
    url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/k0zwZFlUTtg2DOb2OFGoVERr1O5d1RLP/MyanmarJojarPro/MyanmarJojarPro-Regular.ttf"
  },
  {
    name: "MyanmarKoz",
    url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/JRAoUmxfLBEi6t6953Q40l4pAUos67IU/koz001/koz001_regular.ttf"
  },
  {
    name: "MyanmarWaso",
    url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/BdSkKmrB2aa6AeHgOOM4KW4Kehuvf0da/MyanmarWaso/MyanmarWaso-Regular.ttf"
  }
];


function isDisabledDomain(): boolean {
  const host = window.location.hostname;
  return DISABLED_DOMAINS.some(
    (domain) => host === domain || host.endsWith("." + domain)
  );
}

function loadCustomFonts(): void {
  if (isDisabledDomain()) {
    return;
  }

  const styleId = "custom-font-faces";
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    return;
  }

  const style = document.createElement("style");
  style.id = styleId;

  let fontFaceRules = "";
  for (let i = 0; i < customFonts.length; i++) {
    const font = customFonts[i];
    fontFaceRules += "@font-face { font-family: '" + font.name + "'; src: url('" + font.url + "'); font-weight: normal; font-style: normal; font-display: swap; } ";
  }

  style.textContent = fontFaceRules;
  
  const head = document.head;
  if (head) {
    head.appendChild(style);
  }
}

function applyFontSettings(): void {
  if (isDisabledDomain()) {
    return;
  }

  chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
    if (!result.fontFamily && !result.fontStyle) {
      return;
    }

    const family = result.fontFamily || "Arial";
    const styleValue = result.fontStyle || "normal";

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

    const styleId = "custom-font-style";
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      const head = document.head;
      if (head) {
        head.appendChild(styleEl);
      }
    }

    const cssRules = "* { font-family: '" + family + "', sans-serif !important; font-weight: " + fontWeight + " !important; font-style: " + fontStyleCSS + " !important; }";

    styleEl.textContent = cssRules;
  });
}

let applyTimeout: number | null = null;

function observeDomChanges(): void {
  const observer = new MutationObserver(() => {
    if (applyTimeout) {
      return;
    }

    applyTimeout = window.setTimeout(() => {
      applyFontSettings();
      applyTimeout = null;
    }, 100);
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}

function initialize(): void {
  if (isDisabledDomain()) {
    return;
  }

  loadCustomFonts();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyFontSettings);
  } else {
    applyFontSettings();
  }

  if (document.fonts) {
    document.fonts.ready.then(() => {
      applyFontSettings();
    });
  }

  observeDomChanges();
}

initialize();

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && (changes.fontFamily || changes.fontStyle)) {
    applyFontSettings();
  }
});


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
//     url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/BdSkKmrB2aa6AeHgOOM4KW4Kehuvf0da/MyanmarWaso/MyanmarWaso-Regular.ttf"
//   }
// ];

// const disabledDomains = ["mmfontshub.app"];

// function isDisabledDomain(): boolean {
//   const host = window.location.hostname;
//   return disabledDomains.some(
//     (domain) => host === domain || host.endsWith("." + domain)
//   );
// }

// function loadCustomFonts() {
//   if (isDisabledDomain()) return;

//   const styleId = "custom-font-faces";
//   if (document.getElementById(styleId)) return;

//   const style = document.createElement("style");
//   style.id = styleId;

//   style.textContent = customFonts
//     .map(
//       (font) => `
// @font-face {
//   font-family: '${font.name}';
//   src: url('${font.url}');
//   font-weight: normal;
//   font-style: normal;
//   font-display: swap;
// }
// `
//     )
//     .join("\n");

//   document.head.appendChild(style);
// }

// function applyFontSettings() {
//   if (isDisabledDomain()) return;

//   chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
//     if (!result.fontFamily && !result.fontStyle) return;

//     const family = result.fontFamily || "Arial";
//     const style = result.fontStyle || "normal";

//     let fontWeight = "normal";
//     let fontStyleCSS = "normal";

//     if (style === "bold") {
//       fontWeight = "bold";
//     } else if (style === "italic") {
//       fontStyleCSS = "italic";
//     } else if (style === "bold-italic") {
//       fontWeight = "bold";
//       fontStyleCSS = "italic";
//     }

//     const styleId = "custom-font-style";
//     let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

//     if (!styleEl) {
//       styleEl = document.createElement("style");
//       styleEl.id = styleId;
//       document.documentElement.appendChild(styleEl);
//     }

//     styleEl.textContent = `
// html, body {
//   font-family: '${family}', sans-serif !important;
//   font-weight: ${fontWeight} !important;
//   font-style: ${fontStyleCSS} !important;
// }
// `;
//   });
// }

// let applyTimeout: number | null = null;

// function observeDomChanges() {
//   const observer = new MutationObserver(() => {
//     if (applyTimeout) return;

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

// if (!isDisabledDomain()) {
//   loadCustomFonts();

//   document.fonts.ready.then(() => {
//     applyFontSettings();
//   });

//   observeDomChanges();
// }

// chrome.storage.onChanged.addListener((changes, area) => {
//   if (
//     area === "sync" &&
//     (changes.fontFamily || changes.fontStyle)
//   ) {
//     applyFontSettings();
//   }
// });



// // content.ts

// // Define custom fonts with their URLs
// const customFonts = [
//     {
//       name: "MyanmarJojarPro",
//       url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/k0zwZFlUTtg2DOb2OFGoVERr1O5d1RLP/MyanmarJojarPro/MyanmarJojarPro-Regular.ttf"
//     },
//     {
//       name: "MyanmarKoz",
//       url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/JRAoUmxfLBEi6t6953Q40l4pAUos67IU/koz001/koz001_regular.ttf"
//     },
//     {
//       name: "MyanmarWaso",
//       url: "https://cvbawrrt6ky4ctvk.public.blob.vercel-storage.com/fonts/BdSkKmrB2aa6AeHgOOM4KW4Kehuvf0da/MyanmarWaso/MyanmarWaso-Regular.ttf"
//     }
//   ];
  
//   // Domains where font customization should be disabled
//   const disabledDomains = ["mmfontshub.app"];
  
//   // Check if current domain is disabled
//   function isDisabledDomain(): boolean {
//     const currentDomain = window.location.hostname;
//     return disabledDomains.some(
//       (domain) => currentDomain === domain || currentDomain.endsWith("." + domain)
//     );
//   }
  
//   // Load custom fonts
//   function loadCustomFonts() {
//     if (isDisabledDomain()) return;
  
//     const fontFaceId = "custom-font-faces";
//     let fontFaceStyle = document.getElementById(fontFaceId);
  
//     if (!fontFaceStyle) {
//       fontFaceStyle = document.createElement("style");
//       fontFaceStyle.id = fontFaceId;
//       document.head.appendChild(fontFaceStyle);
//     }
  
//     const fontFaceRules = customFonts
//       .map(
//         (font) => `
//         @font-face {
//           font-family: '${font.name}';
//           src: url('${font.url}');
//           font-weight: normal;
//           font-style: normal;
//           font-display: swap;
//         }
//       `
//       )
//       .join("\n");
  
//     fontFaceStyle.textContent = fontFaceRules;
//   }
  
//   // Apply font settings
//   function applyFontSettings() {
//     chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
//       if (result.fontFamily || result.fontStyle) {
//         const family = result.fontFamily || "Arial";
//         const style = result.fontStyle || "normal";
  
//         const styleId = "custom-font-style";
//         let styleEl = document.getElementById(styleId);
  
//         if (!styleEl) {
//           styleEl = document.createElement("style");
//           styleEl.id = styleId;
//           document.head.appendChild(styleEl);
//         }
  
//         let fontWeight = "normal";
//         let fontStyleCSS = "normal";
  
//         if (style === "bold") {
//           fontWeight = "bold";
//         } else if (style === "italic") {
//           fontStyleCSS = "italic";
//         } else if (style === "bold-italic") {
//           fontWeight = "bold";
//           fontStyleCSS = "italic";
//         }
  
//         styleEl.textContent = `
//           html,body {
//             font-family: '${family}', sans-serif !important;
//             font-weight: ${fontWeight} !important;
//             font-style: ${fontStyleCSS} !important;
//           }
//         `;
//       }
//     });
//   }
  
//   // Initialize: load fonts, then apply settings once fonts are ready
//   loadCustomFonts();
//   document.fonts.ready.then(() => {
//     applyFontSettings();
//   });
  
//   // Listen for storage changes (when settings are updated from popup)
//   chrome.storage.onChanged.addListener((changes, namespace) => {
//     if (namespace === "sync" && (changes.fontFamily || changes.fontStyle)) {
//       document.fonts.ready.then(() => {
//         applyFontSettings();
//       });
//     }
//   });