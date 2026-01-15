
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { PlayerProfile, DriverStats, CarStats, LeagueTier, Investment, Team, Race } from '../types';
import { CALENDAR, TIER_CONFIG, ACADEMIES, TEAMS } from '../constants';
import { 
  BarChart3, Rocket, Trophy, Play, Plus, Coins, 
  Calendar as CalendarIcon, MapPin, Award, Home, 
  Flag, User, DollarSign, Gem, CheckCircle, ShoppingBag, 
  Dumbbell, Briefcase, Gamepad2, Bed, Users, Radio, Lock, Unlock, AlertTriangle, Save, Power,
  Zap, Shield, Hexagon, Triangle, Circle, Skull, Diamond, Sword, Ghost, Globe, Tv, Newspaper,
  Timer, Gauge, Cloud, CloudRain, Sun, Wind, Thermometer, ChevronRight, List, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, PieChart, Wallet, Scale, Minus, Activity, Info
} from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  setProfile: (p: PlayerProfile) => void;
  onStartRace: () => void;
  onSave: () => void;
  onExit: () => void;
  hasUnsavedChanges: boolean;
}

type Tab = 'home' | 'race' | 'driver' | 'team' | 'finances' | 'lifestyle';
type RaceTabMode = 'calendar' | 'standings';
type NewsCategory = 'global' | 'drivers' | 'teams';

const AI_DRIVER_NAMES: Record<string, string[]> = {
  't1': ['C. Leclirc', 'C. Saint'],
  't2': ['L. Hamiltin', 'G. Russel'],
  't3': ['M. Virstappen', 'S. Periz'],
  't4': ['L. Morris', 'O. Pastry'],
  't5': ['F. Alonsow', 'L. Stroll'],
  't6': ['E. Ocon', 'P. Gasly'],
  't7': ['Y. Tsunoda', 'L. Lawless'],
  't8': ['A. Albin', 'F. Paint'],
  't9': ['N. Hulkinberg', 'K. Magnussin'],
  't10': ['V. Bottis', 'G. Zhow'],
  'r4_1': ['K. Anthony', 'O. Beerman'],
  'r4_2': ['J. Duhan', 'T. Porch'],
  'r4_3': ['P. Aron', 'Z. OSullivan'],
  'r4_4': ['G. Tiny', 'D. Began'],
  'r4_5': ['A. Lindbad', 'I. Badger'],
  'r4_6': ['R. Miyata', 'K. Maini'],
  'r4_7': ['C. Collet', 'L. Browning'],
  'r4_8': ['T. Inthraphuvasak', 'N. Tsolov'],
  'r4_9': ['M. Boya', 'S. Ramos'],
  'r4_10': ['C. Mansell', 'L. Fornaroli'],
};

const HELMET_COLORS: Record<string, { primary: string, secondary: string, accent: string, visor: string }> = {
  'helmet_rb': { primary: '#0f172a', secondary: '#1e3a8a', accent: '#ef4444', visor: '#fbbf24' },
  'helmet_fer': { primary: '#dc2626', secondary: '#991b1b', accent: '#fca5a5', visor: '#000000' },
  'helmet_merc': { primary: '#e5e7eb', secondary: '#9ca3af', accent: '#22d3ee', visor: '#4b5563' },
  'helmet_mcl': { primary: '#f97316', secondary: '#c2410c', accent: '#3b82f6', visor: '#1e3a8a' },
  'helmet_am': { primary: '#064e3b', secondary: '#065f46', accent: '#bef264', visor: '#111827' },
};

const HelmetSVG = ({ id, className }: { id: string, className?: string }) => {
  const colors = HELMET_COLORS[id] || HELMET_COLORS['helmet_rb'];
  return (
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
      <path d="M50 12 C28 12 12 32 12 55 V82 C12 88 16 92 24 92 H76 C84 92 88 88 88 82 V55 C88 32 72 12 50 12 Z" fill={`url(#grad_${id})`} stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <path d="M48 12 L46 92 H54 L52 12 Z" fill={colors.accent} opacity="0.9" />
      <path d="M16 42 H84 C86 42 88 44 88 52 C88 68 84 76 74 76 H26 C16 76 12 68 12 52 C12 44 14 42 16 42 Z" fill={`url(#visor_${id})`} stroke="#111" strokeWidth="2" />
    </svg>
  );
};

const TeamLogoIcon = ({ id, className, style }: { id: string, className?: string, style?: React.CSSProperties }) => {
  switch (id) {
    case 'zap': return <Zap className={className} style={style} fill="currentColor" fillOpacity={0.2} />;
    case 'shield': return <Shield className={className} style={style} fill="currentColor" fillOpacity={0.2} />;
    case 'hexagon': return <Hexagon className={className} style={style} fill="currentColor" fillOpacity={0.2} />;
    case 'triangle': return <Triangle className={className} style={style} fill="currentColor" fillOpacity={0.2} />;
    case 'skull': return <Skull className={className} style={style} />;
    case 'diamond': return <Diamond className={className} style={style} fill="currentColor" fillOpacity={0.2} />;
    case 'sword': return <Sword className={className} style={style} />;
    case 'ghost': return <Ghost className={className} style={style} />;
    default: return <Circle className={className} style={style} />;
  }
};

const Hub: React.FC<Props> = ({ profile, setProfile, onStartRace, onSave, onExit, hasUnsavedChanges }) => {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [raceTabMode, setRaceTabMode] = useState<RaceTabMode>('calendar');
  const [financeTab, setFinanceTab] = useState<LeagueTier>('R4');
  const nextRace = CALENDAR[profile.currentRaceIndex];
  const tierConfig = TIER_CONFIG[profile.tier];
  
  const [newsCategory, setNewsCategory] = useState<NewsCategory>('global');
  const [currentHeadline, setCurrentHeadline] = useState("");

  const standings = useMemo(() => {
    const teamsInTier = TEAMS.filter(t => t.tier === profile.tier);
    const drivers: any[] = [];
    teamsInTier.forEach(team => {
      const driverNames = AI_DRIVER_NAMES[team.id] || ['Unknown A', 'Unknown B'];
      driverNames.forEach((name, index) => {
        let isPlayer = false;
        let driverName = name;
        let points = 0;
        if (profile.team?.id === team.id && index === 0) {
          isPlayer = true;
          driverName = profile.name;
          points = profile.careerPoints;
        } else {
          const basePerf = team.basePerformance / 100;
          const variance = Math.sin(team.id.charCodeAt(0) + profile.season + index) * 5;
          points = Math.max(0, Math.floor((basePerf * profile.currentRaceIndex * 15) + variance));
        }
        drivers.push({ name: driverName, team: team, points: points, isPlayer: isPlayer });
      });
    });
    drivers.sort((a, b) => b.points - a.points);
    const constructorsMap: Record<string, { team: any, points: number, drivers: string[] }> = {};
    drivers.forEach(d => {
      if (d.team) {
        if (!constructorsMap[d.team.id]) constructorsMap[d.team.id] = { team: d.team, points: 0, drivers: [] };
        constructorsMap[d.team.id].points += d.points;
        constructorsMap[d.team.id].drivers.push(d.name);
      }
    });
    const constructors = Object.values(constructorsMap).sort((a, b) => b.points - a.points);
    return { drivers, constructors };
  }, [profile.careerPoints, profile.currentRaceIndex, profile.name, profile.team, profile.season, profile.tier]);

  useEffect(() => {
    const generateHeadline = () => {
      const driverName = profile.name;
      const teamName = profile.team?.name || "Privateer Entry";
      const location = nextRace?.location || "the Paddock";
      const twistedDrivers = ['M. Virstappen', 'L. Hamiltin', 'C. Leclirc', 'L. Morris', 'F. Alonsow'];
      const randomTwistedDriver = twistedDrivers[Math.floor(Math.random() * twistedDrivers.length)];
      
      const headlines: Record<NewsCategory, string[]> = {
        global: [
          `BREAKING: IFA technical delegates to inspect all front wings after ${location} race.`,
          `MARKET WATCH: Pirellio shares surge as they announce new "Apex-Soft" compounds.`,
          `RUMOR: Next year's Neon Strip GP to be held under 50,000 artificial sun-lamps.`,
          `TECH: Petronis developing new carbon-neutral fuel for the 2026 reg changes.`,
          `IFA President: "We are monitoring the budget cap compliance of top-tier teams."`
        ],
        drivers: [
          `Rivalry: ${randomTwistedDriver} claims ${driverName} is the 'one to watch' in ${profile.tier}.`,
          `Paddock Chatter: Is ${randomTwistedDriver} looking for a seat at ${teamName}?`,
          `Physicality: Trainers claim ${driverName}'s neck-strength is now record-breaking.`,
          `SILVER STARS: ${randomTwistedDriver} hints at retirement after current contract expires.`,
          `FAN POLL: ${driverName} voted most aggressive overtaker of the month.`
        ],
        teams: [
          `${teamName} principal confirms they are bringing a major floor update to the next GP.`,
          `RELIABILITY: Blue Bull Racing worried about ERS temperatures in the desert heat.`,
          `SPONSORSHIP: Shale Oil extends multi-billion dollar partnership with Valkyrie Rosso.`,
          `DATA: Spectre Racing claims their new simulator is 99.9% accurate to track conditions.`,
          `MIST RACING: New wind tunnel in Enstine is now fully operational.`
        ]
      };
      return headlines[newsCategory][Math.floor(Math.random() * headlines[newsCategory].length)];
    };
    setCurrentHeadline(generateHeadline());
  }, [newsCategory, profile.name, profile.team, profile.tier, profile.currentRaceIndex]);

  const buyShares = (team: Team, percent: number) => {
    const cost = (team.marketValue / 100) * percent;
    if (profile.budget >= cost) {
      const investments = [...profile.investments];
      const existing = investments.find(inv => inv.teamId === team.id);
      if (existing) existing.percentage += percent;
      else investments.push({ teamId: team.id, percentage: percent });
      setProfile({ ...profile, budget: profile.budget - cost, investments, lastUpdated: new Date().toISOString() });
    }
  };

  const sellShares = (team: Team, percent: number) => {
    const investments = [...profile.investments];
    const existingIndex = investments.findIndex(inv => inv.teamId === team.id);
    if (existingIndex > -1) {
      const canSell = Math.min(investments[existingIndex].percentage, percent);
      const profit = (team.marketValue / 100) * canSell;
      investments[existingIndex].percentage -= canSell;
      if (investments[existingIndex].percentage <= 0) investments.splice(existingIndex, 1);
      setProfile({ ...profile, budget: profile.budget + profit, investments, lastUpdated: new Date().toISOString() });
    }
  };

  const renderHome = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl flex flex-col h-full min-h-[220px]">
               <div className="absolute inset-0 bg-[url('https://media.istockphoto.com/id/175425686/photo/tv-noise.jpg?s=612x612&w=0&k=20&c=N2aY5y9bFwzFkC8R1i1f8p9g1e5q3s7u9w2y4x6z8')] opacity-5 mix-blend-overlay pointer-events-none"></div>
               <div className="relative z-10 flex flex-col h-full">
                   <div className="bg-red-700 px-4 py-2 flex justify-between items-center">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center"><Tv size={12} className="mr-2" /> Global Network</span>
                       <div className="flex items-center space-x-1.5"><div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div><span className="text-[9px] font-bold text-white uppercase">LIVE PADDOCK</span></div>
                   </div>
                   <div className="p-4 flex-1 flex items-center justify-center text-center">
                       <div key={currentHeadline} className="animate-in fade-in slide-in-from-right duration-500"><p className="text-sm md:text-base font-orbitron font-bold text-white leading-tight">"{currentHeadline}"</p></div>
                   </div>
                   <div className="bg-black/80 border-t border-white/10 flex divide-x divide-white/10">
                        {['global', 'drivers', 'teams'].map((cat) => (
                            <button key={cat} onClick={() => setNewsCategory(cat as NewsCategory)} className={`flex-1 py-2 text-[9px] font-bold uppercase transition-all ${newsCategory === cat ? (cat === 'drivers' ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white') : 'text-gray-500 hover:text-white'}`}>{cat}</button>
                        ))}
                   </div>
               </div>
           </div>
           <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between h-full min-h-[220px]">
              <div><h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center"><CalendarIcon size={12} className="mr-2 text-red-500"/> Weekend Status</h3><p className="text-[10px] text-gray-400 mt-1">{nextRace?.name || "Season End"}</p></div>
              <div className="mt-auto">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-2"><span>Session</span><span className="text-red-500">{profile.currentSession}</span></div>
                  <button onClick={onStartRace} className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron font-black py-3 rounded-xl shadow-lg transition-all text-xs uppercase tracking-widest">Start Session</button>
              </div>
           </div>
       </div>
    </div>
  );

  const renderRace = () => (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4">
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 mb-4 shrink-0">
           <button onClick={() => setRaceTabMode('calendar')} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${raceTabMode === 'calendar' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>Calendar</button>
           <button onClick={() => setRaceTabMode('standings')} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-xl transition-all ${raceTabMode === 'standings' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>Standings</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-24 pr-1 custom-scrollbar">
            {raceTabMode === 'calendar' ? CALENDAR.map((race, index) => {
                const isActive = index === profile.currentRaceIndex;
                const isPast = index < profile.currentRaceIndex;
                return (
                    <div key={index} className={`relative rounded-xl border transition-all duration-300 ${isActive ? 'border-red-500 bg-red-950/20 ring-2 ring-red-500/20' : 'border-white/5 bg-white/5'}`}>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded text-gray-300">RD {index + 1}</span>
                                    {isActive && <span className="text-[9px] font-black uppercase tracking-widest bg-red-600 px-1.5 py-0.5 rounded text-white animate-pulse">ACTIVE</span>}
                                    {isPast && <CheckCircle size={12} className="text-green-500" />}
                                </div>
                                <div className="text-[10px] text-gray-500 font-bold uppercase">{race.date}</div>
                            </div>
                            
                            <h3 className="font-orbitron font-black text-white text-base uppercase italic leading-tight truncate">{race.name}</h3>
                            <div className="flex items-center text-[10px] text-gray-400 font-bold uppercase mt-1">
                                <MapPin size={10} className="mr-1" /> {race.location}
                            </div>

                            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/5">
                                <div className="text-center">
                                    <span className="block text-[8px] text-gray-500 font-black uppercase mb-0.5">Laps</span>
                                    <span className="text-[10px] font-bold text-white">{race.laps}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[8px] text-gray-500 font-black uppercase mb-0.5">Type</span>
                                    <span className="text-[10px] font-bold text-white">{race.circuitType}</span>
                                </div>
                                <div className="text-center">
                                    <span className="block text-[8px] text-gray-500 font-black uppercase mb-0.5">Turns</span>
                                    <span className="text-[10px] font-bold text-white">{race.turns}</span>
                                </div>
                            </div>
                            <div className="mt-3 bg-black/30 p-2 rounded text-[9px] font-mono text-gray-400 flex items-center">
                               <Trophy size={10} className="mr-1.5 text-yellow-500" /> REC: {race.lapRecord}
                            </div>
                        </div>
                    </div>
                );
            }) : (
              <div className="grid grid-cols-2 gap-3 pb-8">
                {/* Driver Standings Column */}
                 <div className="glass-card rounded-2xl overflow-hidden border border-white/10 h-fit">
                    <div className="bg-white/5 p-3 font-orbitron font-bold text-[9px] uppercase border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center"><User size={12} className="mr-1.5 text-red-500" /> Drivers</div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {standings.drivers.map((d, i) => (
                          <div key={i} className={`flex justify-between items-center p-2.5 text-[9px] ${d.isPlayer ? 'bg-red-500/20' : ''}`}>
                              <span className="flex items-center space-x-1.5 overflow-hidden">
                                  <span className="w-3 text-gray-500 font-mono">{i+1}</span>
                                  <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: `${d.team.color}20` }}>
                                      <TeamLogoIcon id={d.team.logoId} className="w-2 h-2" style={{ color: d.team.color }} />
                                  </div>
                                  <span className={`truncate ${d.isPlayer ? 'text-red-500 font-bold' : 'text-white'}`}>{d.name.split(' ').pop()}</span>
                              </span>
                              <span className="font-bold tabular-nums text-white shrink-0">{d.points}</span>
                          </div>
                      ))}
                    </div>
                 </div>

                 {/* Team Standings Column */}
                 <div className="glass-card rounded-2xl overflow-hidden border border-white/10 h-fit">
                    <div className="bg-white/5 p-3 font-orbitron font-bold text-[9px] uppercase border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center"><Users size={12} className="mr-1.5 text-blue-500" /> Teams</div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {standings.constructors.map((c, i) => (
                          <div key={i} className={`flex justify-between items-center p-2.5 text-[9px] ${c.team.id === profile.team?.id ? 'bg-blue-500/20' : ''}`}>
                              <span className="flex items-center space-x-1.5 overflow-hidden">
                                  <span className="w-3 text-gray-500 font-mono">{i+1}</span>
                                  <div className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.team.color}20` }}>
                                      <TeamLogoIcon id={c.team.logoId} className="w-2 h-2" style={{ color: c.team.color }} />
                                  </div>
                                  <span className="text-white truncate font-bold">{c.team.name.split(' ')[0]}</span>
                              </span>
                              <span className="font-bold tabular-nums text-white shrink-0">{c.points}</span>
                          </div>
                      ))}
                    </div>
                 </div>
              </div>
            )}
        </div>
    </div>
  );

  const renderFinances = () => {
     const totalInvestmentValue = profile.investments.reduce((acc, inv) => {
         const t = TEAMS.find(team => team.id === inv.teamId);
         return acc + ((inv.percentage / 100) * (t?.marketValue || 0));
     }, 0);
     const teamsInTier = TEAMS.filter(t => t.tier === financeTab);
     return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4">
      <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-green-900/10 to-black border-green-500/30">
         <div className="grid grid-cols-2 gap-4">
             <div><p className="text-[10px] text-gray-500 font-bold uppercase">Liquid Cash</p><p className="text-2xl font-mono font-bold text-white">${Math.floor(profile.budget).toLocaleString()}</p></div>
             <div><p className="text-[10px] text-gray-500 font-bold uppercase">Portfolio Value</p><p className="text-2xl font-mono font-bold text-blue-400">${Math.floor(totalInvestmentValue).toLocaleString()}</p></div>
         </div>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col">
          <div className="flex border-b border-white/10">{(['R1', 'R2', 'R3', 'R4'] as LeagueTier[]).map(tier => (<button key={tier} onClick={() => setFinanceTab(tier)} className={`flex-1 py-3 text-[10px] font-black uppercase transition-all ${financeTab === tier ? 'bg-white text-black' : 'text-gray-500 hover:bg-white/5'}`}>{tier}</button>))}</div>
          <div className="p-4 space-y-4">
              {teamsInTier.map(team => {
                  const owned = profile.investments.find(inv => inv.teamId === team.id);
                  const ownershipPercent = owned ? owned.percentage : 0;
                  const onePercentCost = team.marketValue / 100;
                  return (
                      <div key={team.id} className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col gap-4">
                          <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10" style={{backgroundColor: `${team.color}20`}}><div style={{ color: team.color }}><TeamLogoIcon id={team.logoId} className="w-5 h-5" /></div></div>
                                  <div><div className="font-black text-xs text-white uppercase">{team.name}</div><div className="text-[10px] text-gray-500 font-bold uppercase">Value: <span className="text-white">${team.marketValue.toLocaleString()}</span></div></div>
                              </div>
                              <div className="text-right"><div className="text-[10px] text-green-500 font-bold uppercase">Yield: {(team.dividendYield * 100).toFixed(1)}%</div></div>
                          </div>
                          <div className="grid grid-cols-2 gap-3"><button onClick={() => buyShares(team, 1)} disabled={profile.budget < onePercentCost || ownershipPercent >= 100} className="w-full py-2 rounded-lg bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/30 text-[9px] font-black uppercase transition-all disabled:opacity-20">Buy 1%</button><button onClick={() => sellShares(team, 1)} disabled={ownershipPercent < 1} className="w-full py-2 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-[9px] font-black uppercase transition-all disabled:opacity-20">Sell 1%</button></div>
                      </div>
                  )
              })}
          </div>
      </div>
    </div>
  )};

  const renderDriver = () => (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-4 text-blue-400"><h3 className="font-orbitron font-bold text-sm uppercase">Driver Mastery</h3><span className="text-[10px] bg-blue-500/20 px-2 py-1 rounded font-bold">{profile.skillPoints} SP</span></div>
              <div className="space-y-3">{['pace', 'concentration', 'stamina', 'experience'].map(key => (
                    <div key={key}><div className="flex justify-between text-[10px] uppercase text-gray-500 font-bold mb-1"><span>{key}</span><span className="text-white">{profile.driverStats[key as keyof DriverStats]}</span></div>
                      <div className="flex items-center space-x-2"><div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{ width: `${profile.driverStats[key as keyof DriverStats]}%` }} /></div><button onClick={() => { if (profile.skillPoints > 0) setProfile({ ...profile, skillPoints: profile.skillPoints - 1, driverStats: { ...profile.driverStats, [key]: (profile.driverStats[key as keyof DriverStats] as number) + 2 }, lastUpdated: new Date().toISOString() }); }} disabled={profile.skillPoints === 0} className="text-blue-500 disabled:opacity-30"><Plus size={14}/></button></div></div>
                ))}</div>
            </div>
            <div className="glass-card p-5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-4 text-red-500"><h3 className="font-orbitron font-bold text-sm uppercase">Engineering</h3><span className="text-[10px] bg-red-500/20 px-2 py-1 rounded font-bold">{profile.techPoints} TP</span></div>
              <div className="space-y-3">{Object.entries(profile.carStats).map(([key, val]) => (
                  <div key={key}><div className="flex justify-between text-[10px] uppercase text-gray-500 font-bold mb-1"><span>{key}</span><span className="text-white">{val}</span></div>
                    <div className="flex items-center space-x-2"><div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{ width: `${val}%` }} /></div><button onClick={() => { if (profile.techPoints > 0) setProfile({ ...profile, techPoints: profile.techPoints - 1, carStats: { ...profile.carStats, [key]: (profile.carStats[key as keyof CarStats] as number) + 2 }, lastUpdated: new Date().toISOString() }); }} disabled={profile.techPoints === 0} className="text-red-500 disabled:opacity-30"><Plus size={14}/></button></div></div>
                ))}</div>
            </div>
        </div>
    </div>
  );

  return (
    <div className={`fixed inset-0 bg-[#0a0a0a] flex flex-col ${tierConfig.bg} bg-cover bg-fixed bg-no-repeat overflow-hidden`}>
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-0" />
      
      {/* Header */}
      <nav className="relative z-50 border-b border-white/5 bg-black/90 backdrop-blur-md p-3 shrink-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 bg-white/5 relative shadow-lg">{profile.avatarSeed ? <HelmetSVG id={profile.avatarSeed} className="w-full h-full" /> : <div className="w-full h-full flex items-center justify-center bg-gray-800"><User size={20} className="text-gray-500" /></div>}</div>
             <div className="flex flex-col"><h1 className="text-white font-orbitron font-bold text-sm tracking-tight leading-none mb-1">{profile.name}</h1><div className="flex items-center space-x-2 bg-white/5 px-2 py-1 rounded border border-white/10 w-fit"><div style={{ color: profile.team?.color }}><TeamLogoIcon id={profile.team?.logoId || 'circle'} className="w-3 h-3" /></div><span className="text-[9px] text-gray-300 uppercase font-bold">{profile.team?.name || "Free Agent"}</span></div></div>
          </div>
          <div className="flex flex-col items-end space-y-1">
             <div className="flex items-center space-x-1.5 bg-green-900/20 px-2 py-1 rounded border border-green-500/30"><Coins className="text-green-500 w-3 h-3" /><span className="text-[10px] font-mono font-bold text-green-400">${Math.floor(profile.budget / 1000).toLocaleString()}k</span></div>
             <div className="flex items-center space-x-1"><button onClick={onSave} className={`p-1.5 rounded-lg border ${hasUnsavedChanges ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-white/5 border-white/10 text-gray-400'}`}><Save size={14} /></button><button onClick={onExit} className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400"><Power size={14} /></button></div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-md mx-auto p-4 overflow-hidden">
         {activeTab === 'home' && renderHome()}
         {activeTab === 'race' && renderRace()}
         {activeTab === 'driver' && renderDriver()}
         {activeTab === 'finances' && renderFinances()}
      </main>

      {/* Bottom Nav */}
      <div className="relative z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 shrink-0">
         <div className="max-w-md mx-auto flex justify-around items-center p-2">
            {[
              { id: 'home', icon: Home, label: 'Home' },
              { id: 'race', icon: Flag, label: 'Race' },
              { id: 'driver', icon: User, label: 'Driver' },
              { id: 'finances', icon: DollarSign, label: 'Finance' }
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id as Tab)} className={`flex flex-col items-center p-2 px-4 rounded-xl transition-all ${activeTab === item.id ? 'text-red-500 bg-red-500/10' : 'text-gray-500 active:scale-95'}`}>
                 <item.icon size={20} className={activeTab === item.id ? 'fill-current' : ''} />
                 <span className="text-[9px] font-bold uppercase mt-1">{item.label}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Hub;
