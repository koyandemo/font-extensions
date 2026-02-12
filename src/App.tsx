import { useEffect, useState } from "react";
import MainScreen from "./components/screen/MainScreen";
import WelcomeScreen from "./components/screen/WelcomeScreen";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.storage.local.get(["token"], (result:any) => {
      setToken(result.token || null);
      setLoading(false);
    });
  }, []);

  // const handleLogin = (newToken: string) => {
  //   chrome.storage.local.set({ token: newToken });
  //   setToken(newToken);
  // };

  // const handleLogout = () => {
  //   chrome.storage.local.remove("token");
  //   setToken(null);
  // };

  if (loading) return <div>Loading...</div>;

  return token ? (
    <MainScreen  />
  ) : (
    <WelcomeScreen  />
  );
}

export default App;
