import { useState, useEffect } from "react";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import {
  CUSTOM_FONTS,
  DISABLED_DOMAINS,
  FONT_STYLES,
  SYSTEM_FONTS,
} from "../../lib/utils";

export default function Popup() {
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontStyle, setFontStyle] = useState("normal");

  // Load saved settings on mount
  useEffect(() => {
    chrome.storage.sync.get(["fontFamily", "fontStyle"], (result) => {
      if (result.fontFamily) setFontFamily(result.fontFamily as string);
      if (result.fontStyle) setFontStyle(result.fontStyle as string);
    });
  }, []);

  // Apply font changes to the current page
  const applyFontSettings = () => {
    // Save to chrome storage when Apply button is clicked
    chrome.storage.sync.set({ fontFamily: fontFamily, fontStyle: fontStyle });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id || !tab.url) return;

      const url = new URL(tab.url);
      const hostname = url.hostname;

      // 🚫 Check if domain is blocked
      const isBlocked = DISABLED_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith("." + domain)
      );

      if (isBlocked) {
        console.log("Font Customizer disabled on this domain:", hostname);
        return; // STOP here
      }

      // ✅ Allowed → inject font script
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (family: string, style: string) => {
          const styleId = "custom-font-style";
          let styleEl = document.getElementById(styleId);

          if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = styleId;
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

          styleEl.textContent = `
            * {
              font-family: '${family}', sans-serif !important;
              font-weight: ${fontWeight} !important;
              font-style: ${fontStyleCSS} !important;
            }
          `;
        },
        args: [fontFamily, fontStyle],
      });
    });
  };

  // Save and apply settings when changed
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
    // No automatic storage - only updates local state
  };

  const handleFontStyleChange = (value: string) => {
    setFontStyle(value);
    // No automatic storage - only updates local state
  };

  const resetFontSettings = () => {
    console.log("110");
    const defaultFamily = "Arial";
    const defaultStyle = "normal";

    setFontFamily(defaultFamily);
    setFontStyle(defaultStyle);

    chrome.storage.sync.remove(["fontFamily", "fontStyle"]);

    // Also remove style from page
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;

      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const styleEl = document.getElementById("custom-font-style");
          if (styleEl) styleEl.remove();
        },
      });
    });
  };

  return (
    <div className="w-[320px] p-5 bg-background">
      <h2 className="text-lg font-semibold mb-5 text-foreground">
        Font Customizer
      </h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="font-family" className="text-sm font-medium">
            Font Family
          </Label>
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger id="font-family" className="w-full text-white">
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                Myanmar Fonts
              </div>
              {CUSTOM_FONTS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.name}
                </SelectItem>
              ))}

              <Separator className="my-2" />

              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                System Fonts
              </div>
              {SYSTEM_FONTS.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-style" className="text-sm font-medium">
            Font Style
          </Label>
          <Select value={fontStyle} onValueChange={handleFontStyleChange}>
            <SelectTrigger id="font-style" className="w-full text-white">
              <SelectValue placeholder="Select font style" />
            </SelectTrigger>
            <SelectContent>
              {FONT_STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={applyFontSettings} className="w-full">
          Apply to Current Page
        </Button>

        <Button onClick={resetFontSettings} className="w-full">
          Reset to Default
        </Button>

        <Card>
          <CardContent className="pt-4">
            <p
              className="text-xs text-muted-foreground"
              style={{
                fontFamily: `'${fontFamily}', sans-serif`,
                fontWeight: fontStyle.includes("bold") ? "bold" : "normal",
                fontStyle: fontStyle.includes("italic") ? "italic" : "normal",
              }}
            >
              Preview: The quick brown fox jumps over the lazy dog.
            </p>
            <p
              className="text-sm mt-2"
              style={{
                fontFamily: `'${fontFamily}', sans-serif`,
                fontWeight: fontStyle.includes("bold") ? "bold" : "normal",
                fontStyle: fontStyle.includes("italic") ? "italic" : "normal",
              }}
            >
              မြန်မာစာ ဥပမာ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

//   const applyFontSettings = () => {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       if (tabs[0]?.id) {
//         chrome.scripting.executeScript({
//           target: { tabId: tabs[0].id },
//           func: (family: string, style: string) => {
//             const styleId = "custom-font-style";
//             let styleEl = document.getElementById(styleId);

//             if (!styleEl) {
//               styleEl = document.createElement("style");
//               styleEl.id = styleId;
//               document.head.appendChild(styleEl);
//             }

//             let fontWeight = "normal";
//             let fontStyleCSS = "normal";

//             if (style === "bold") {
//               fontWeight = "bold";
//             } else if (style === "italic") {
//               fontStyleCSS = "italic";
//             } else if (style === "bold-italic") {
//               fontWeight = "bold";
//               fontStyleCSS = "italic";
//             }

//             styleEl.textContent = `
//               * {
//                 font-family: '${family}', sans-serif !important;
//                 font-weight: ${fontWeight} !important;
//                 font-style: ${fontStyleCSS} !important;
//               }
//             `;
//           },
//           args: [fontFamily, fontStyle]
//         });
//       }
//     });
//   };
