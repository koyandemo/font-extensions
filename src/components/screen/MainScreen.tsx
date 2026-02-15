import React, { useState} from "react";
import type {ViewT } from "../../types/index.type";
import SettingsScreen from "../SettingsScreen";
import EmptyState from "../EmptyState";
import FontList from "./FontList";
import Header from "../Header";

interface MainScreenProps {
  onLogout: () => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewT>("LIST");
  const [hasFonts] = useState(true);

  const renderContent = () => {
    if (currentView === "SETTINGS") {
      return <SettingsScreen onLogout={onLogout} />;
    }

    if (!hasFonts) {
      return <EmptyState />;
    }

    return <FontList />; 
  };

  return (
    <div className="flex flex-col h-full bg-white font-['Inter']">
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={onLogout}
      />
      <main className="flex-1 relative overflow-hidden">{renderContent()}</main>
    </div>
  );
};


export default MainScreen;
