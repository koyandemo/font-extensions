export class FontService {
  static DEFAULT_SIZE = "medium";
  static DEFAULT_STYLE = "normal";

  static applyFont(family: string, style: string, size: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id) return;

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (family: string, style: string, size: string) => {
          const STYLE_ID = "fc-custom-style";
          let styleEl = document.getElementById(STYLE_ID);

          if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = STYLE_ID;
            document.head.appendChild(styleEl);
          }

          let fontWeight = "normal";
          let fontStyleCSS = "normal";

          if (style === "bold") fontWeight = "bold";
          else if (style === "italic") fontStyleCSS = "italic";
          else if (style === "bold-italic") {
            fontWeight = "bold";
            fontStyleCSS = "italic";
          }

          let scale = 1;
          if (size === "small") scale = 0.85;
          else if (size === "large") scale = 1.15;

          styleEl.textContent = `
              html {
                font-size: ${scale}em !important;
              }
              * {
                font-family: '${family}', sans-serif !important;
                font-weight: ${fontWeight} !important;
                font-style: ${fontStyleCSS} !important;
              }
            `;
        },
        args: [family, style, size],
      });
    });
  }

  static resetFont() {
    chrome.storage.sync.set({
      fontId: "5", // Arial id
      fontFamily: "Arial",
      fontStyle: this.DEFAULT_STYLE,
      fontSize: this.DEFAULT_SIZE,
    });

    // reload apply
    this.applyFont("Arial", this.DEFAULT_STYLE, this.DEFAULT_SIZE);
  }
}

/**
 * @old_version
 */

// import { DISABLED_DOMAINS, STYLE_ID, FONT_SIZES } from "../lib/utils";

// export const FontService = {
//   applyFont: (family: string, style: string, size: string) => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const tab = tabs[0];
//       if (!tab?.id || !tab.url) return;

//       const hostname = new URL(tab.url).hostname;

//       const isBlocked = DISABLED_DOMAINS.some(
//         (d) => hostname === d || hostname.endsWith("." + d)
//       );

//       if (isBlocked) return;

//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         func: (family: string, style: string, size: string, STYLE_ID: string, FONT_SIZES: any[]) => {
//           let styleEl = document.getElementById(STYLE_ID);

//           if (!styleEl) {
//             styleEl = document.createElement("style");
//             styleEl.id = STYLE_ID;
//             document.head.appendChild(styleEl);
//           }

//           let fontWeight = "normal";
//           let fontStyleCSS = "normal";

//           if (style === "bold") fontWeight = "bold";
//           else if (style === "italic") fontStyleCSS = "italic";
//           else if (style === "bold-italic") {
//             fontWeight = "bold";
//             fontStyleCSS = "italic";
//           }

//           const sizeConfig = FONT_SIZES.find((s) => s.value === size);
//           const scale = sizeConfig ? sizeConfig.scale : 1;

//           styleEl.textContent = `
//             html {
//               font-size: ${scale}em !important;
//             }
//             * {
//               font-family: '${family}', sans-serif !important;
//               font-weight: ${fontWeight} !important;
//               font-style: ${fontStyleCSS} !important;
//             }
//           `;
//         },
//         args: [family, style, size, STYLE_ID, FONT_SIZES],
//       });
//     });
//   },
// };
