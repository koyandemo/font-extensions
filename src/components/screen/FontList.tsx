import React, { useState, useEffect } from "react";
import { Search, Check } from "lucide-react";

import {
  FONT_CONFIG,
  DEFAULT_STYLE,
  DISABLED_DOMAINS,
  FONT_FACE_ID,
  STORAGE_KEYS,
} from "../../lib/utils";

const FontList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedFont, setSelectedFont] = useState<any | null>(null);
  const [appliedFontId, setAppliedFontId] = useState<string | null>(null);
  const [fontStyle, setFontStyle] = useState<string>(DEFAULT_STYLE);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
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
  }, []);

  /* -------------------------------------------------- */
  /* 🔥 Load saved settings */
  /* -------------------------------------------------- */
  useEffect(() => {
    chrome.storage.sync.get(
      [STORAGE_KEYS.id, STORAGE_KEYS.family, STORAGE_KEYS.style],
      (res: any) => {
        if (res[STORAGE_KEYS.id]) {
          setAppliedFontId(res[STORAGE_KEYS.id]);

          const found = FONT_CONFIG.find(
            (f) => f.id === res[STORAGE_KEYS.id]
          );
          setSelectedFont(found || null);
        } else {
          const arial = FONT_CONFIG.find((f) => f.family === "Arial");
          setSelectedFont(arial || null);
        }

        if (res[STORAGE_KEYS.style]) {
          setFontStyle(res[STORAGE_KEYS.style]);
        }
      }
    );
  }, []);

  /* -------------------------------------------------- */
  /* 🔥 Inject font into active tab */
  /* -------------------------------------------------- */
  const injectFont = (family: string, style: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab?.id || !tab.url) return;

      const hostname = new URL(tab.url).hostname;

      const isBlocked = DISABLED_DOMAINS.some(
        (d) => hostname === d || hostname.endsWith("." + d)
      );

      if (isBlocked) return;

      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (family: string, style: string) => {
          const STYLE_ID = "fc-custom-font-style";
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

          styleEl.textContent = `
            * {
              font-family: '${family}', sans-serif !important;
              font-weight: ${fontWeight} !important;
              font-style: ${fontStyleCSS} !important;
            }
          `;
        },
        args: [family, style],
      });
    });
  };

  const handleApply = (font: any) => {
    chrome.storage.sync.set({
      [STORAGE_KEYS.id]: font.id,
      [STORAGE_KEYS.family]: font.family,
      [STORAGE_KEYS.style]: fontStyle,
    });

    injectFont(font.family, fontStyle);

    setAppliedFontId(font.id);
    setSelectedFont(font);

    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 1500);
  };

  const handleReset = () => {
    const arial = FONT_CONFIG.find((f) => f.family === "Arial");
    if (!arial) return;

    chrome.storage.sync.set({
      [STORAGE_KEYS.id]: arial.id,
      [STORAGE_KEYS.family]: arial.family,
      [STORAGE_KEYS.style]: DEFAULT_STYLE,
    });

    injectFont(arial.family, DEFAULT_STYLE);

    setAppliedFontId(arial.id);
    setSelectedFont(arial);
    setFontStyle(DEFAULT_STYLE);
  };

  const filteredFonts = FONT_CONFIG.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* SEARCH */}
      <div className="px-5 py-4 sticky top-0 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fonts..."
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl outline-none"
          />
        </div>
      </div>

      {/* FONT LIST */}
      <div className="flex-1 overflow-y-auto pb-32">
        {selectedFont && selectedFont.id === appliedFontId && (
          <div className="px-6 py-3 bg-[#fef3c7] border-b border-yellow-100">
            <div className="flex items-center gap-2 text-[11px] font-bold text-[#d97706] uppercase tracking-wider mb-0.5">
              <Check className="w-3.5 h-3.5" />
              Active Font
            </div>
            <div className="text-base font-bold text-gray-900">
              {selectedFont.name}
            </div>
          </div>
        )}

        {filteredFonts.map((font) => {
          const isActive = selectedFont?.id === font.id;

          return (
            <button
              key={font.id}
              onClick={() => setSelectedFont(font)}
              className={`w-full flex justify-between px-6 py-5 border-l-4 ${
                isActive
                  ? "bg-yellow-50 border-yellow-500"
                  : "border-transparent"
              }`}
            >
              <div className="flex flex-col items-start gap-1 text-left">
                <div className="text-base font-bold text-[#1e293b]">
                  {font.name}
                </div>
                <p
                  className="text-xs text-muted-foreground"
                  style={{
                    fontFamily: `'${font.family}', sans-serif`,
                    fontWeight: fontStyle.includes("bold")
                      ? "bold"
                      : "normal",
                    fontStyle: fontStyle.includes("italic")
                      ? "italic"
                      : "normal",
                  }}
                >
                  {font.preview}
                </p>
              </div>

              {isActive && <Check />}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-0 right-0 px-6 space-y-2">
        <button
          onClick={() => selectedFont && handleApply(selectedFont)}
          className="w-full py-2 bg-yellow-500 text-white rounded-full"
        >
          Apply Font
        </button>

        <button
          onClick={handleReset}
          className="w-full py-2 bg-gray-200 rounded-full"
        >
          Reset (Arial)
        </button>

        {isSuccess && (
          <div className="text-center text-xs text-green-600">
            Font applied successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default FontList;
