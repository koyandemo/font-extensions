// service worker

/// <reference types="chrome" />
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    console.log("Received message:", message);
    console.log("Sender",sender);

    if (message.type === "LOGIN") {
      const token = message.token;

      // ✅ Save token
      chrome.storage.local.set({ token }, () => {
        console.log("Token saved:", token);

        // ✅ Notify all extension pages (popup)
        chrome.runtime.sendMessage({
          type: "AUTH_CHANGED",
          token,
        });
      });

      sendResponse({ status: "logged-in" });
    }

    if (message.type === "LOGOUT") {
      chrome.storage.local.remove("token", () => {
        console.log("Token removed");

        // ✅ Notify popup
        chrome.runtime.sendMessage({
          type: "AUTH_CHANGED",
          token: null,
        });
      });

      sendResponse({ status: "logged-out" });
    }

    return true;
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    "From website via content script:",
    message,
    sender,
    sendResponse
  );
});
