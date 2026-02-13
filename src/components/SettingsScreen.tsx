
import React, { useState } from 'react';
import { ChevronRight, Info } from 'lucide-react';
import type { UserPreferencesT } from '../types/index.type';


interface SettingsScreenProps {
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const [prefs, setPrefs] = useState<UserPreferencesT>({
    defaultFont: 'None',
    fontSize: 'Medium',
    autoApply: false,
    rememberPerSite: true,
  });

  const toggleAutoApply = () => setPrefs(p => ({ ...p, autoApply: !p.autoApply }));
  const toggleRemember = () => setPrefs(p => ({ ...p, rememberPerSite: !p.rememberPerSite }));

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-y-auto pb-10">
      <div className="p-5 space-y-8">
        
        {/* Font Preferences */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-4">Font Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Default Font</label>
              <div className="relative">
                <select 
                  value={prefs.defaultFont}
                  onChange={(e) => setPrefs(p => ({ ...p, defaultFont: e.target.value }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option>None</option>
                  <option>Myanmar Sans Pro</option>
                  <option>Pyidaungsu</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 px-1">Auto-apply this font on all websites</p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Font Size</label>
              <div className="relative">
                <select 
                  value={prefs.fontSize}
                  onChange={(e) => setPrefs(p => ({ ...p, fontSize: e.target.value as any }))}
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Auto-Apply Settings */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-4">Auto-Apply Settings</h3>
          <div className="space-y-5 bg-white p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Auto-apply fonts</div>
                <div className="text-[10px] text-gray-400">Automatically apply selected font on page load</div>
              </div>
              <button 
                onClick={toggleAutoApply}
                className={`w-11 h-6 rounded-full transition-colors relative ${prefs.autoApply ? 'bg-yellow-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${prefs.autoApply ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Remember per site</div>
                <div className="text-[10px] text-gray-400">Remember last used font for each website</div>
              </div>
              <button 
                onClick={toggleRemember}
                className={`w-11 h-6 rounded-full transition-colors relative ${prefs.rememberPerSite ? 'bg-yellow-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${prefs.rememberPerSite ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h3 className="text-sm font-bold text-gray-800 mb-4">About</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-3 px-1 py-2 text-gray-400 mb-2">
              <Info className="w-4 h-4" />
              <span className="text-xs">Version 1.0.0</span>
            </div>
            {[
              { label: 'Privacy Policy', path: '#' },
              { label: 'Help & Support', path: '#' },
              { label: 'Rate This Extension', path: '#' },
            ].map((item, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center justify-between py-3 px-1 border-b border-gray-100 last:border-0 hover:bg-white transition-colors"
              >
                <span className="text-sm text-gray-700">{item.label}</span>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </section>

        <button 
          onClick={onLogout}
          className="w-full py-3.5 border border-red-200 text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors mt-4"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default SettingsScreen;
