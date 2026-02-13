// import React, { useState, useEffect } from "react";
// import MainScreen from "./components/screen/MainScreen";
// import WelcomeScreen from "./components/screen/WelcomeScreen";

// // Mock chrome API for browser preview compatibility
// // const chromeMock = {
// //   storage: {
// //     local: {
// //       get: (keys: string[], cb: (res: any) => void) => {
// //         const token = localStorage.getItem('token');
// //         cb({ token });
// //       },
// //       set: (data: any) => {
// //         if (data.token) localStorage.setItem('token', data.token);
// //       },
// //       remove: (key: string | string[]) => {
// //         if (Array.isArray(key)) {
// //           key.forEach(k => localStorage.removeItem(k));
// //         } else {
// //           localStorage.removeItem(key);
// //         }
// //       },
// //     },
// //     sync: {
// //       get: (keys: string[], cb: (res: any) => void) => cb({}),
// //       set: (data: any) => {},
// //     }
// //   },
// //   runtime: {
// //     onMessage: {
// //       addListener: (cb: any) => {},
// //       removeListener: (cb: any) => {},
// //     },
// //     sendMessage: (msg: any) => {},
// //   },
// //   tabs: {
// //     query: (query: any, cb: any) => cb([{ id: 1, url: 'https://example.com' }]),
// //   },
// //   scripting: {
// //     executeScript: (obj: any) => {},
// //   }
// // };

// /**
//  * Robustly determine if we are in a real Chrome Extension environment.
//  * Standard Chrome browsers define window.chrome, but only extensions have chrome.storage or chrome.runtime.id.
//  */
// // const getChromeAPI = () => {
// //   const win = window as any;
// //   if (win.chrome && win.chrome.storage && win.chrome.runtime && win.chrome.runtime.id) {
// //     return win.chrome;
// //   }
// // };

// // const chromeAPI = getChromeAPI();

// const App: React.FC = () => {
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // initial load
//     chrome.storage.local.get(["token"], (result: any) => {
//       setToken(result.token || null);
//       setLoading(false);
//     });

//     // ✅ listen for updates
//     const listener = (message: any) => {
//       if (message.type === "AUTH_CHANGED") {
//         setToken(message.token || null);
//       }
//     };

//     chrome.runtime.onMessage.addListener(listener);

//     return () => {
//       chrome.runtime.onMessage.removeListener(listener);
//     };
//   }, []);

//   // useEffect(() => {
//   //   chromeAPI.storage.local.get(["token"], (result: any) => {
//   //     setToken(result.token || null);
//   //     setLoading(false);
//   //   });

//   //   const listener = (message: any) => {
//   //     if (message.type === "AUTH_CHANGED") {
//   //       setToken(message.token || null);
//   //     }
//   //   };

//   //   if (chromeAPI.runtime.onMessage) {
//   //     chromeAPI.runtime.onMessage.addListener(listener);
//   //   }

//   //   return () => {
//   //     if (chromeAPI.runtime.onMessage) {
//   //       chromeAPI.runtime.onMessage.removeListener(listener);
//   //     }
//   //   };
//   // }, []);

//   // const handleLogin = (newToken: string) => {
//   //   chromeAPI.storage.local.set({ token: newToken });
//   //   setToken(newToken);
//   // };

//   const handleLogout = () => {
//     chrome.storage.local.remove("token");
//     setToken(null);
//   };

//   if (loading) {
//     return (
//       <div className="w-[360px] h-[580px] flex items-center justify-center bg-white">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-[360px] h-[580px] bg-white overflow-hidden shadow-2xl relative">
//       {token ? <MainScreen onLogout={handleLogout} /> : <WelcomeScreen />}
//     </div>
//   );
// };

// export default App;

/**
 * @old_version
 */
import { useEffect, useState } from "react";
import MainScreen from "./components/screen/MainScreen";
import WelcomeScreen from "./components/screen/WelcomeScreen";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // initial load
    chrome.storage.local.get(["token"], (result: any) => {
      setToken(result.token || null);
      setLoading(false);
    });

    // ✅ listen for updates
    const listener = (message: any) => {
      if (message.type === "AUTH_CHANGED") {
        setToken(message.token || null);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  // const handleLogin = (newToken: string) => {
  //   chrome.storage.local.set({ token: newToken });
  //   setToken(newToken);
  // };

  const handleLogout = () => {
    chrome.storage.local.remove("token");
    setToken(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-[300px]">
      {token ?  <MainScreen onLogout={handleLogout} /> : <WelcomeScreen />}
    </div>
  )
}

export default App;
