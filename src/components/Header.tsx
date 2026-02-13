
import React from 'react';
import { Settings, LogOut, ArrowLeft } from 'lucide-react';
import type { ViewT } from '../types/index.type';

interface HeaderProps {
  currentView: ViewT;
  onNavigate: (view: ViewT) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onLogout }) => {
  return (
    <header className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 sticky top-0 z-10 h-[70px]">
      <div className="flex items-center gap-3">
        {currentView === 'SETTINGS' ? (
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('LIST')}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-[#1e293b]">Settings</h1>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#d9a02d] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-2xl leading-none italic">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-wider leading-none">Myanmar</span>
              <span className="text-xs font-black text-gray-900 uppercase tracking-tighter leading-none">Font Hub</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {currentView !== 'SETTINGS' && (
          <button 
            onClick={() => onNavigate('SETTINGS')}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={onLogout}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
