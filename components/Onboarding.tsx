
import React, { useState } from 'react';
import { User, Flag, ChevronRight } from 'lucide-react';

interface Props {
  onComplete: (name: string, nationality: string) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && nationality) {
      onComplete(name, nationality);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-card p-8 rounded-2xl shadow-2xl border-t-4 border-red-600">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/20">
            <span className="text-white font-orbitron text-2xl font-black">F1</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-orbitron font-bold text-center mb-2 uppercase tracking-tighter">Apex Career</h1>
        <p className="text-gray-400 text-center mb-8 text-sm">Write your own legend on the grid.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-widest">Driver Name</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-3 focus-within:border-red-500 transition-colors">
              <User className="text-gray-400 mr-3 w-5 h-5" />
              <input 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Lewis Hamilton" 
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-widest">Nationality</label>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-3 focus-within:border-red-500 transition-colors">
              <Flag className="text-gray-400 mr-3 w-5 h-5" />
              <input 
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                placeholder="e.g. British" 
                className="bg-transparent border-none outline-none w-full text-white placeholder:text-gray-600"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron font-bold py-4 rounded-lg flex items-center justify-center group transition-all transform hover:scale-[1.02]"
          >
            START CAREER
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
