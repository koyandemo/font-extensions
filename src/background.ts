// service worker

/// <reference types="chrome" />
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed!");
});

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    console.log("Received message:", message);
    console.log("Sender:", sender);

    if (message.type === "LOGIN") {
      sendResponse({ status: "logged-in" });
    }

    if (message.type === "LOGOUT") {
      sendResponse({ status: "logged-out" });
    }

    return true;
  }
);


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("From website via content script:", message,sender,sendResponse);
});


// chrome.runtime.onMessageExternal.addListener(
//   async (message, sender, sendResponse) => {
//     console.log(message,"message")
//     console.log(sender,"sender")
//     if (message.type === "LOGIN") {
//       console.dir(message);
//       sendResponse({ message: "OK" });
//       return true;
//     }

//     if (message.type === "LOGOUT") {
//       console.dir(message);
//       sendResponse({ message: "OK" });
//       return true;
//     }
//   }
// );
