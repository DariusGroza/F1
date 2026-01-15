
import React from 'react';
import { ChevronLeft, Volume2, Monitor } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Settings: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-lg w-full glass-card p-8 rounded-2xl animate-in slide-in-from-right">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="mr-4 p-2 bg-white/10 rounded-full hover:bg-white/20">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-orbitron font-black uppercase">System Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
             <Volume2 className="text-gray-400 mr-3" />
             <span className="font-bold uppercase text-sm">Master Volume</span>
          </div>
          <input type="range" className="w-24 accent-red-600" />
        </div>

        <div className="bg-white/5 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center">
             <Monitor className="text-gray-400 mr-3" />
             <span className="font-bold uppercase text-sm">Graphics Quality</span>
          </div>
          <select className="bg-black border border-white/20 rounded px-2 py-1 text-xs uppercase font-bold">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Ultra</option>
          </select>
        </div>
        
        <div className="text-center pt-8">
           <p className="text-[10px] text-gray-600 uppercase tracking-widest">Version 1.2.0 • Build 8842</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
