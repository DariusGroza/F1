
import React, { useState } from 'react';
import { SaveSlot } from '../types';
import { User, Trash2, Settings as SettingsIcon, BookOpen, LogOut, Disc, Trophy, Flag, Zap, Gauge, Rocket, ChevronRight, ShoppingBag, Star, Package, CreditCard, Check } from 'lucide-react';
import Tutorial from './Tutorial';
import Settings from './Settings';

interface Props {
  saveSlots: SaveSlot[];
  onStartNew: (slotId: number) => void;
  onLoad: (slotId: number) => void;
  onDelete: (slotId: number) => void;
}

// --- HELMET LOGIC (Duplicated for portability) ---
const HELMET_COLORS: Record<string, { primary: string, secondary: string, accent: string, visor: string }> = {
  'helmet_rb': { primary: '#0f172a', secondary: '#1e3a8a', accent: '#ef4444', visor: '#fbbf24' },
  'helmet_fer': { primary: '#dc2626', secondary: '#991b1b', accent: '#fca5a5', visor: '#000000' },
  'helmet_merc': { primary: '#e5e7eb', secondary: '#9ca3af', accent: '#22d3ee', visor: '#4b5563' },
  'helmet_mcl': { primary: '#f97316', secondary: '#c2410c', accent: '#3b82f6', visor: '#1e3a8a' },
  'helmet_am': { primary: '#064e3b', secondary: '#065f46', accent: '#bef264', visor: '#111827' },
};

const HelmetSVG = ({ id, className }: { id: string, className?: string }) => {
  const colors = HELMET_COLORS[id] || HELMET_COLORS['helmet_rb']; // Fallback
  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`grad_lp_${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor={colors.secondary} />
        </linearGradient>
        <linearGradient id={`visor_lp_${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.visor} />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>
      <path d="M50 12 C28 12 12 32 12 55 V82 C12 88 16 92 24 92 H76 C84 92 88 88 88 82 V55 C88 32 72 12 50 12 Z" fill={`url(#grad_lp_${id})`} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <path d="M48 12 L46 92 H54 L52 12 Z" fill={colors.accent} opacity="0.9" />
      <path d="M12 58 C12 58 25 50 50 50 C75 50 88 58 88 58" fill="none" stroke={colors.accent} strokeWidth="2" opacity="0.5" />
      <path d="M16 42 H84 C86 42 88 44 88 52 C88 68 84 76 74 76 H26 C16 76 12 68 12 52 C12 44 14 42 16 42 Z" fill={`url(#visor_lp_${id})`} stroke="#111" strokeWidth="2" />
      <path d="M16 44 H84 C84 44 85 44 85 48 H15 C15 44 16 44 16 44 Z" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
};

const LandingPage: React.FC<Props> = ({ saveSlots, onStartNew, onLoad, onDelete }) => {
  const [view, setView] = useState<'menu' | 'slots' | 'tutorial' | 'settings' | 'store'>('menu');

  const renderMenu = () => (
    <div className="flex flex-col items-center w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-20 px-6">
       {/* Logo Section - Spaced out for better visual balance */}
       <div className="flex flex-col items-center mb-10 relative select-none">
          {/* Decorative Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/20 blur-[80px] rounded-full animate-pulse"></div>
          
          <div className="relative flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-500">
             <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-3xl skew-x-[-10deg] flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)] border-t border-white/20">
                <Flag size={40} className="text-white fill-white/20 skew-x-[10deg]" />
             </div>
             <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 p-2 rounded-xl skew-x-[-10deg] shadow-xl">
                 <Zap size={20} className="text-yellow-400 fill-yellow-400 skew-x-[10deg]" />
             </div>
          </div>

          <h1 className="text-center flex flex-col items-center leading-none">
            <span className="text-4xl md:text-5xl font-orbitron font-black italic tracking-tighter text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] skew-x-[-10deg] mb-1">
              FORMULA
            </span>
            <span className="text-3xl md:text-4xl font-orbitron font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-text-shimmer drop-shadow-sm skew-x-[-10deg] pr-2">
              PRO SIM
            </span>
          </h1>
          
          <div className="flex items-center space-x-2 mt-4 bg-black/60 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
             <Gauge size={12} className="text-red-500" />
             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Formula Career Simulator</span>
          </div>
       </div>
       
       {/* Main Action Button - Android Friendly Size */}
       <button 
         onClick={() => setView('slots')} 
         className="w-full mb-4 group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 p-0.5 rounded-2xl transition-transform active:scale-95 shadow-xl touch-manipulation"
       >
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
         
         <div className="relative bg-black/20 rounded-[14px] p-5 flex items-center justify-between h-full w-full backdrop-blur-sm border border-white/10 group-hover:bg-black/10 transition-colors">
            <div className="flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mr-5 border border-white/20 group-hover:bg-white group-hover:text-red-600 transition-colors text-white">
                  <Rocket className="fill-current transform rotate-45 group-hover:rotate-0 transition-transform duration-300" size={24} />
                </div>
                <div className="text-left">
                  <div className="font-orbitron font-black text-lg uppercase tracking-wider text-white">Start Engine</div>
                  <div className="text-[10px] text-red-200 font-bold uppercase tracking-widest">Begin Legacy</div>
                </div>
            </div>
            <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
               <ChevronRight size={20} className="text-white" />
            </div>
         </div>
       </button>

       {/* Secondary Buttons - Grid - Larger for touch */}
       <div className="grid grid-cols-3 gap-3 w-full">
         <button onClick={() => setView('tutorial')} className="group bg-black/40 active:bg-black/60 border border-white/10 active:border-red-500/50 p-4 rounded-2xl flex flex-col items-center justify-center transition-all backdrop-blur-md touch-manipulation active:scale-95">
            <BookOpen className="mb-2 text-blue-400 group-hover:text-white transition-colors" size={24} />
            <span className="font-orbitron font-bold text-[10px] uppercase tracking-wider text-gray-300 group-hover:text-white">Guide</span>
         </button>
         
         <button onClick={() => setView('store')} className="group bg-black/40 active:bg-black/60 border border-white/10 active:border-red-500/50 p-4 rounded-2xl flex flex-col items-center justify-center transition-all backdrop-blur-md touch-manipulation active:scale-95">
            <ShoppingBag className="mb-2 text-green-400 group-hover:text-white transition-colors" size={24} />
            <span className="font-orbitron font-bold text-[10px] uppercase tracking-wider text-gray-300 group-hover:text-white">Store</span>
         </button>

         <button onClick={() => setView('settings')} className="group bg-black/40 active:bg-black/60 border border-white/10 active:border-red-500/50 p-4 rounded-2xl flex flex-col items-center justify-center transition-all backdrop-blur-md touch-manipulation active:scale-95">
            <SettingsIcon className="mb-2 text-yellow-500 group-hover:text-white transition-colors" size={24} />
            <span className="font-orbitron font-bold text-[10px] uppercase tracking-wider text-gray-300 group-hover:text-white">Config</span>
         </button>
       </div>
    </div>
  );

  const renderStore = () => (
    <div className="w-full max-w-2xl animate-in zoom-in-95 duration-300 relative z-20 px-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-orbitron font-black text-white uppercase italic drop-shadow-md flex items-center">
          <ShoppingBag className="mr-3 text-red-500" /> Store
        </h2>
        <button onClick={() => setView('menu')} className="text-white font-bold uppercase text-xs flex items-center bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl border border-white/10 transition-all touch-manipulation">
          <LogOut className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Featured Item */}
        <div className="md:col-span-2 relative group overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-black">
           <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">BESTSELLER</div>
           <div className="p-6 flex items-center justify-between relative z-10">
              <div>
                 <div className="flex items-center space-x-2 mb-2">
                    <Star className="text-yellow-400 fill-yellow-400" size={18} />
                    <h3 className="font-orbitron font-black text-xl text-white italic">PRO LICENSE</h3>
                 </div>
                 <p className="text-sm text-gray-400 max-w-xs mb-4 leading-relaxed">Unlock unlimited save slots, custom liveries editor, and the historic 1990s car pack.</p>
                 <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-sm px-8 py-3 rounded-xl uppercase tracking-wider flex items-center transition-colors touch-manipulation">
                    $4.99 <ChevronRight size={16} className="ml-1"/>
                 </button>
              </div>
              <div className="hidden md:block opacity-50 group-hover:opacity-100 transition-opacity">
                 <Trophy size={90} className="text-yellow-500" />
              </div>
           </div>
        </div>

        {/* Store Items */}
        {[
          { title: "V10 Sound Pack", price: "$1.99", icon: <Package size={28} className="text-blue-400"/>, desc: "High fidelity audio" },
          { title: "No Ads", price: "$2.99", icon: <CreditCard size={28} className="text-green-400"/>, desc: "Uninterrupted play" },
          { title: "Track Editor", price: "$9.99", icon: <Disc size={28} className="text-purple-400"/>, desc: "Create your own circuits" },
          { title: "Manager Mode", price: "$5.99", icon: <User size={28} className="text-red-400"/>, desc: "Team principal DLC" },
        ].map((item, i) => (
           <div key={i} className="glass-card p-5 rounded-xl border border-white/5 active:bg-white/5 transition-colors flex items-center justify-between touch-manipulation">
              <div className="flex items-center space-x-4">
                 <div className="bg-white/5 p-3 rounded-lg">{item.icon}</div>
                 <div>
                    <h4 className="font-bold text-white text-sm uppercase mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider">{item.desc}</p>
                 </div>
              </div>
              <button className="bg-white/10 active:bg-white active:text-black text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors">
                 {item.price}
              </button>
           </div>
        ))}
      </div>
    </div>
  );

  const renderSlots = () => (
    <div className="w-full max-w-4xl animate-in zoom-in-95 duration-300 relative z-20 px-4 pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-orbitron font-black text-white uppercase italic drop-shadow-md">Select Profile</h2>
        <button onClick={() => setView('menu')} className="text-white font-bold uppercase text-xs flex items-center bg-red-600/20 active:bg-red-600 px-4 py-3 rounded-xl border border-red-600/30 transition-all touch-manipulation">
          <LogOut className="w-4 h-4 mr-2" /> Paddock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {saveSlots.map((slot) => (
          <div key={slot.id} className="relative group glass-card p-1 rounded-2xl border border-white/10 hover:border-red-500 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] bg-black/40 backdrop-blur-xl">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
             
             <div className="p-5 relative z-10 h-full flex flex-col">
              {slot.profile ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                            {/* Generated Helmet */}
                            {slot.profile.avatarSeed ? (
                                <HelmetSVG 
                                  id={slot.profile.avatarSeed} 
                                  className="w-full h-full drop-shadow-lg transform rotate-[-5deg]"
                                />
                            ) : (
                                <User size={28} className="text-gray-400 group-hover:text-white transition-colors" /> 
                            )}
                        </div>
                        <div>
                           <h3 className="font-orbitron font-black text-xl text-white tracking-wide italic leading-none">{slot.profile.name}</h3>
                           <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-[10px] font-bold text-white bg-red-600 px-2 py-0.5 rounded uppercase">{slot.profile.tier}</span>
                              <span className="text-[10px] font-bold text-gray-300 bg-white/10 px-2 py-0.5 rounded uppercase">S{slot.profile.season}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded border border-yellow-400/20">
                          <Trophy size={14} className="fill-current" />
                          <span className="font-orbitron font-bold text-sm">{slot.profile.trophies.length}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs mb-6 mt-auto">
                     <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                        <span className="block text-gray-500 font-bold uppercase text-[9px] mb-1">Team</span>
                        <div className="text-white font-semibold truncate flex items-center text-xs"><Flag size={12} className="mr-1.5 text-red-500"/> {slot.profile.team?.name || "Free Agent"}</div>
                     </div>
                     <div className="bg-black/50 p-3 rounded-lg border border-white/5">
                        <span className="block text-gray-500 font-bold uppercase text-[9px] mb-1">Last Race</span>
                        <div className="text-white font-semibold text-xs">P{slot.profile.results[slot.profile.results.length - 1]?.position || "-"}</div>
                     </div>
                  </div>

                  <div className="flex space-x-3">
                     <button 
                       onClick={() => onLoad(slot.id)}
                       className="flex-1 bg-white hover:bg-red-600 hover:text-white text-black font-orbitron font-black py-3 rounded-xl uppercase transition-all text-xs tracking-wider flex items-center justify-center shadow-lg touch-manipulation"
                     >
                       <Gauge size={16} className="mr-2" /> Load
                     </button>
                     <button 
                       onClick={() => { if(confirm('Delete this save?')) onDelete(slot.id); }}
                       className="px-4 py-3 bg-red-900/20 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-500 hover:text-white rounded-xl transition-all touch-manipulation"
                     >
                       <Trash2 size={18} />
                     </button>
                  </div>
                </>
              ) : (
                <div className="h-full min-h-[220px] flex flex-col items-center justify-center py-6 opacity-60 group-hover:opacity-100 transition-all duration-300">
                   <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center mb-4 group-hover:border-red-500 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
                      <Disc className="w-10 h-10 text-gray-600 group-hover:text-red-500 transition-colors" />
                   </div>
                   <h3 className="font-orbitron font-bold text-gray-300 uppercase mb-6 tracking-widest text-sm">Empty Slot {slot.id}</h3>
                   <button 
                     onClick={() => onStartNew(slot.id)}
                     className="px-8 py-3 bg-transparent border border-gray-500 rounded-xl text-gray-300 font-bold uppercase hover:bg-red-600 hover:border-red-600 hover:text-white transition-all text-xs tracking-widest hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] touch-manipulation"
                   >
                     New Career
                   </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
       {/* High Quality Colorful Formula Car Background */}
       <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1574519645009-38b43f9cb90a?q=80&w=2670" 
            alt="Formula Car Background" 
            className="w-full h-full object-cover object-center animate-in fade-in duration-1000 scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-red-900/40 mix-blend-overlay z-10"></div>
          <div className="absolute inset-0 bg-black/50 z-10 backdrop-blur-[1px]"></div>
       </div>

       <div className="relative z-20 w-full h-full flex flex-col justify-center items-center py-12 overflow-y-auto">
         {view === 'menu' && renderMenu()}
         {view === 'slots' && renderSlots()}
         {view === 'store' && renderStore()}
         {view === 'tutorial' && <Tutorial onBack={() => setView('menu')} />}
         {view === 'settings' && <Settings onBack={() => setView('menu')} />}
       </div>

       <div className="absolute bottom-4 left-0 right-0 text-center z-20 pointer-events-none px-4">
          <p className="text-[9px] text-gray-400 uppercase font-bold tracking-[0.3em] opacity-80 drop-shadow-md pb-4 sm:pb-0">
            Formula Pro Sim v1.0 • Morningstar Simulation System
          </p>
       </div>
    </div>
  );
};

export default LandingPage;
