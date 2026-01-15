
import React, { useState } from 'react';
import { User, Flag, ChevronRight, Zap, ShieldAlert, BookOpen, X } from 'lucide-react';
import { AcademyId } from '../types';
import { ACADEMIES, TEAMS } from '../constants';

interface Props {
  onComplete: (name: string, nationality: string, avatarSeed: string, academyId: AcademyId, startingTeamId: string) => void;
  onCancel: () => void;
}

const HELMET_OPTIONS = [
  { id: 'helmet_rb', label: 'Energy', colors: { primary: '#0f172a', secondary: '#1e3a8a', accent: '#ef4444', visor: '#fbbf24' } }, // Dark Blue/Red
  { id: 'helmet_fer', label: 'Scarlet', colors: { primary: '#dc2626', secondary: '#991b1b', accent: '#fca5a5', visor: '#000000' } }, // Red/White
  { id: 'helmet_merc', label: 'Silver', colors: { primary: '#e5e7eb', secondary: '#9ca3af', accent: '#22d3ee', visor: '#4b5563' } }, // Silver/Teal
  { id: 'helmet_mcl', label: 'Papaya', colors: { primary: '#f97316', secondary: '#c2410c', accent: '#3b82f6', visor: '#1e3a8a' } }, // Orange/Blue
  { id: 'helmet_am', label: 'Emerald', colors: { primary: '#064e3b', secondary: '#065f46', accent: '#bef264', visor: '#111827' } }, // Green/Lime
];

// Reusable Helmet Component
const HelmetSVG = ({ id, colors, className }: { id: string, colors: any, className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id={`grad_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={colors.primary} />
        <stop offset="100%" stopColor={colors.secondary} />
      </linearGradient>
      <linearGradient id={`visor_${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={colors.visor} />
        <stop offset="100%" stopColor="#000" />
      </linearGradient>
    </defs>
    
    {/* Shadow */}
    <ellipse cx="50" cy="92" rx="35" ry="5" fill="#000" opacity="0.3" />

    {/* Helmet Shell */}
    <path 
      d="M50 12 C28 12 12 32 12 55 V82 C12 88 16 92 24 92 H76 C84 92 88 88 88 82 V55 C88 32 72 12 50 12 Z" 
      fill={`url(#grad_${id})`} 
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
    />
    
    {/* Aero Fin/Details */}
    <path d="M48 12 L46 92 H54 L52 12 Z" fill={colors.accent} opacity="0.9" />
    <path d="M12 58 C12 58 25 50 50 50 C75 50 88 58 88 58" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.5" />

    {/* Visor Area */}
    <path 
      d="M16 42 H84 C86 42 88 44 88 52 C88 68 84 76 74 76 H26 C16 76 12 68 12 52 C12 44 14 42 16 42 Z" 
      fill={`url(#visor_${id})`} 
      stroke="#111" 
      strokeWidth="2" 
    />
    
    {/* Visor Reflection/Glare */}
    <path d="M16 44 H84 C84 44 85 44 85 48 H15 C15 44 16 44 16 44 Z" fill="rgba(255,255,255,0.4)" />
    
    {/* Chin Vent */}
    <path d="M40 82 H60 L58 88 H42 Z" fill="#111" />
    
    {/* Side Circles */}
    <circle cx="20" cy="70" r="4" fill={colors.accent} />
    <circle cx="80" cy="70" r="4" fill={colors.accent} />
  </svg>
);

const CharacterCreation: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [selectedHelmetId, setSelectedHelmetId] = useState<string>('helmet_rb');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && nationality && selectedHelmetId) {
      setStep(2);
    }
  };

  const handleAcademySelect = (id: AcademyId) => {
    const team = TEAMS.find(t => t.tier === 'R4' && t.academyId === id);
    if (team) {
      onComplete(name, nationality, selectedHelmetId, id, team.id);
    }
  };

  // --- STEP 1: Compact Driver License ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm z-50">
        <div className="max-w-md w-full glass-card rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.1)] border-t-4 border-red-600 animate-in zoom-in-95 duration-300">
          
          <div className="p-6 pb-2 border-b border-white/10 flex justify-between items-center">
             <div>
               <h2 className="text-xl font-orbitron font-black text-white uppercase italic">IFA Super License</h2>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">New Applicant Registration</p>
             </div>
             <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={16} className="text-gray-500 hover:text-white" />
             </button>
          </div>

          <div className="p-6 space-y-6">
             {/* Helmet Selection */}
             <div>
                <div className="flex justify-between items-end mb-3">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Helmet Design</label>
                </div>
                
                <div className="flex items-center bg-black/40 p-4 rounded-xl border border-white/5 overflow-x-auto gap-4 custom-scrollbar">
                   {HELMET_OPTIONS.map((helmet) => {
                      const isSelected = selectedHelmetId === helmet.id;
                      return (
                        <button
                          key={helmet.id}
                          type="button"
                          onClick={() => setSelectedHelmetId(helmet.id)}
                          className={`relative flex-shrink-0 rounded-xl transition-all duration-300 overflow-hidden ${isSelected ? 'w-20 h-20 shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-110 z-10 bg-white/5 ring-1 ring-white/20' : 'w-14 h-14 opacity-50 grayscale hover:opacity-100 hover:grayscale-0'}`}
                          title={helmet.label}
                        >
                          <HelmetSVG 
                            id={helmet.id}
                            colors={helmet.colors}
                            className="w-full h-full drop-shadow-lg transform hover:scale-110 transition-transform"
                          />
                        </button>
                      );
                   })}
                </div>
             </div>

             {/* Form Inputs */}
             <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                 <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-red-500/50 focus-within:bg-white/10 transition-all">
                   <User className="text-gray-500 mr-3 w-4 h-4" />
                   <div className="flex-1">
                      <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Driver Name</label>
                      <input 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Max Virstappen" 
                        className="bg-transparent border-none outline-none w-full text-white font-bold text-sm placeholder:text-gray-700 font-orbitron"
                        required
                        autoFocus
                      />
                   </div>
                 </div>
               </div>
    
               <div>
                 <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-red-500/50 focus-within:bg-white/10 transition-all">
                   <Flag className="text-gray-500 mr-3 w-4 h-4" />
                   <div className="flex-1">
                      <label className="block text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Nationality</label>
                      <input 
                        value={nationality}
                        onChange={e => setNationality(e.target.value)}
                        placeholder="e.g. Dutch" 
                        className="bg-transparent border-none outline-none w-full text-white font-bold text-sm placeholder:text-gray-700 font-orbitron"
                        required
                      />
                   </div>
                 </div>
               </div>
    
               <button 
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron font-black text-sm uppercase py-4 rounded-xl flex items-center justify-center group transition-all shadow-lg shadow-red-600/20 mt-2"
               >
                Sign Contract
                <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
             </form>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: Academy Selection (Compact Grid) ---
  return (
    <div className="min-h-screen bg-black/95 flex flex-col items-center justify-center p-4">
      <div className="max-w-5xl w-full animate-in fade-in slide-in-from-bottom-4">
         
         <div className="flex items-center mb-8">
            <button onClick={() => setStep(1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 mr-4 transition-colors">
               <ChevronRight className="rotate-180 text-white" size={20} />
            </button>
            <div>
               <h1 className="text-2xl font-orbitron font-black text-white uppercase italic">Select Academy</h1>
               <p className="text-xs text-gray-400 uppercase tracking-widest">Who will fund your journey?</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.entries(ACADEMIES) as [AcademyId, typeof ACADEMIES[AcademyId]][]).map(([id, data]) => {
              const team = TEAMS.find(t => t.tier === 'R4' && t.academyId === id);
              return (
                <div 
                  key={id}
                  onClick={() => handleAcademySelect(id)}
                  className={`group relative glass-card rounded-2xl p-5 cursor-pointer hover:bg-white/5 transition-all duration-300 border-t-2 hover:-translate-y-1 hover:shadow-xl ${data.color.split(' ')[1]}`}
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-lg border bg-black/20 ${data.color}`}>
                          {id === 'zenith' ? <Zap size={18}/> : id === 'valkyrie' ? <ShieldAlert size={18}/> : id === 'spectre' ? <BookOpen size={18}/> : <Flag size={18}/>}
                      </div>
                      <div className="text-[9px] font-black uppercase bg-white/10 px-2 py-1 rounded text-gray-300">
                         {id === 'indie' ? '$$$' : 'Free'}
                      </div>
                   </div>

                   <h3 className={`font-orbitron font-bold text-sm uppercase mb-1 ${data.color.split(' ')[0]}`}>{data.name}</h3>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 line-clamp-1">{data.philosophy}</p>

                   <p className="text-xs text-gray-400 mb-4 leading-relaxed h-16 overflow-hidden">
                      {data.description}
                   </p>

                   <div className="bg-black/40 p-2.5 rounded-lg border border-white/5 mt-auto">
                      <span className="block text-[9px] text-gray-500 uppercase font-bold mb-0.5">Entry Team</span>
                      <div className="text-white font-bold text-xs flex items-center">
                         <div className="w-1.5 h-1.5 rounded-full mr-1.5" style={{backgroundColor: team?.color}}></div>
                         {team?.name || "Unknown"}
                      </div>
                   </div>
                   
                   <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/10 rounded-2xl transition-all pointer-events-none"></div>
                </div>
              );
            })}
         </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
