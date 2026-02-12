// service worker

/// <reference types="chrome" />
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    console.log(message,"message")
    console.log(sender,"sender")
    if (message.type === "logged-in") {
      console.dir(message);
      sendResponse({ message: "OK" });
      return true;
    }

    if (message.type === "logged-out") {
      console.dir(message);
      sendResponse({ message: "OK" });
      return true;
    }
  }
);
