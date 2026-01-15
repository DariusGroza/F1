
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { PlayerProfile, LiveRaceState, RaceResult, TireType, MechanicalFault, RaceSession } from '../types';
import { POINTS_DISTRIBUTION } from '../constants';
import { getRaceNarrative, getEngineerRadio } from '../services/geminiService';
import { Radio, AlertTriangle, Thermometer, Zap, Timer, Scale, Shield, Mic, MessageSquare, Wrench, AlertOctagon, CloudRain, Cloud, Sun, Settings2, Wind, Activity, Heart, Brain, ChevronRight, Flag, WifiOff, StopCircle, PlayCircle, BarChart, CheckCircle, Gauge, FastForward, Navigation2, TrendingUp, Monitor, Cpu } from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  race: { name: string; laps: number; difficulty: number; length: string; turns: number; lapRecord: string };
  session: RaceSession;
  onFinished: (result: RaceResult) => void;
  onSessionComplete: (results: any) => void;
}

type StrategyKey = 'Aggressive' | 'Balanced' | 'Conservative';

const STRATEGIES = {
  Aggressive: { 
    id: 'Aggressive',
    wear: 1.3,
    fuel: 1.25, 
    risk: 1.5, 
    perfMultiplier: 1.12, 
    label: "Attack",
    description: "Max pace, high deg.",
    icon: Zap,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500"
  },
  Balanced: { 
    id: 'Balanced',
    wear: 1.0, 
    fuel: 1.0, 
    risk: 1.0, 
    perfMultiplier: 1.0, 
    label: "Balanced",
    description: "Standard pace.",
    icon: Scale,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500"
  },
  Conservative: { 
    id: 'Conservative',
    wear: 0.8, 
    fuel: 0.8, 
    risk: 0.6, 
    perfMultiplier: 0.92, 
    label: "Save",
    description: "Protect tires.",
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500"
  }
} as const;

const getWeatherIcon = (weather: string) => {
  switch (weather) {
    case 'Sunny': return <Sun size={14} className="text-yellow-400" />;
    case 'Overcast': return <Cloud size={14} className="text-gray-400" />;
    case 'Rainy': return <CloudRain size={14} className="text-blue-400" />;
    default: return <Sun size={14} className="text-yellow-400" />;
  }
};

const RaceView: React.FC<Props> = ({ profile, race, session, onFinished, onSessionComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [strategy, setStrategy] = useState<StrategyKey>('Balanced');
  const [liveCondition, setLiveCondition] = useState(profile.driverStats.conditioning);
  const [liveConfidence, setLiveConfidence] = useState(profile.driverStats.confidence);
  const [practiceProgress, setPracticeProgress] = useState(0);
  
  // Qualifying States
  const [qualiPhase, setQualiPhase] = useState<'idle' | 'running' | 'finished'>('idle');
  const [qualiSectors, setQualiSectors] = useState<number[]>([0, 0, 0]);
  const [qualiCurrentSector, setQualiCurrentSector] = useState(0);
  const [qualiProgress, setQualiProgress] = useState(0);
  const [finalQualiPos, setFinalQualiPos] = useState<number | null>(null);
  const [poleTime, setPoleTime] = useState("");
  const [playerTime, setPlayerTime] = useState("");
  const [liveDelta, setLiveDelta] = useState(0);

  const initialPos = session === 'RACE' ? (profile.qualifyingPosition || 10) : 1;

  const [raceState, setRaceState] = useState<LiveRaceState>({
    lap: 1,
    totalLaps: race.laps,
    position: initialPos,
    tireWear: 0,
    fuelLevel: 100,
    weather: 'Sunny',
    trackTemp: 42, 
    windSpeed: 12,
    gapToAhead: 1.5,
    gapToBehind: 2.0,
    events: ['Lights out and away we go!'],
    faults: []
  });
  
  const [radioMessage, setRadioMessage] = useState<string>("Radio check. Copy.");
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);
  const [selectedTire, setSelectedTire] = useState<TireType>(TireType.MEDIUM);
  const [pitCountdown, setPitCountdown] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  const runPractice = () => {
     let progress = 0;
     const interval = setInterval(() => {
        progress += 10;
        setPracticeProgress(progress);
        if (progress >= 100) {
           clearInterval(interval);
           const boost = Math.floor(Math.random() * 5) + 2;
           onSessionComplete({ confidenceBoost: boost, conditionBoost: boost });
        }
     }, 500);
  };

  const runQualifying = () => {
    setQualiPhase('running');
    setQualiCurrentSector(0);
    setQualiProgress(0);
    setLiveDelta(0);
    
    const baseLapTime = 85 + (race.difficulty * 10);
    const targetPoleSeconds = baseLapTime * 0.95;
    const playerFinalSeconds = baseLapTime * (1.1 - (profile.carStats.enginePower / 200) * 0.18) + (Math.random() * 1.5);
    
    setPoleTime(formatTime(targetPoleSeconds));

    let currentSectors = [0, 0, 0];
    const interval = setInterval(() => {
      setQualiProgress(prev => {
        const next = prev + 0.5;
        const currentExpectedDelta = (playerFinalSeconds - targetPoleSeconds) * (next / 100);
        setLiveDelta(currentExpectedDelta + (Math.random() * 0.05 - 0.025));

        if (next >= 33 && currentSectors[0] === 0) {
            currentSectors[0] = playerFinalSeconds / 3 + (Math.random() * 0.4 - 0.2);
            setQualiSectors([...currentSectors]);
            setQualiCurrentSector(1);
        }
        if (next >= 66 && currentSectors[1] === 0) {
            currentSectors[1] = playerFinalSeconds / 3 + (Math.random() * 0.4 - 0.2);
            setQualiSectors([...currentSectors]);
            setQualiCurrentSector(2);
        }

        if (next >= 100) {
           clearInterval(interval);
           currentSectors[2] = playerFinalSeconds - (currentSectors[0] + currentSectors[1]);
           setQualiSectors([...currentSectors]);
           setPlayerTime(formatTime(playerFinalSeconds));
           
           const delta = playerFinalSeconds - targetPoleSeconds;
           let pos = 1;
           if (delta > 0.1) pos = 2;
           if (delta > 0.3) pos = 5;
           if (delta > 0.8) pos = 10;
           if (delta > 1.5) pos = 16;
           if (delta > 2.5) pos = 20;
           pos = Math.max(1, Math.min(20, pos + Math.floor(Math.random() * 2)));
           
           setFinalQualiPos(pos);
           setQualiPhase('finished');
        }
        return next;
      });
    }, 40);
  };

  const simulateLap = useCallback(() => {
    setRaceState(prev => {
      if (prev.lap >= prev.totalLaps) return prev;
      const activeStrategy = STRATEGIES[strategy];
      const staminaStatFactor = (100 - profile.driverStats.stamina) / 80; 
      const drainAmount = (0.3 * race.difficulty * staminaStatFactor);
      setLiveCondition(curr => Math.max(0, curr - drainAmount));
      
      const confidenceMult = 0.95 + (liveConfidence / 1000); 
      const tireLife = 100 - prev.tireWear;
      const tirePerf = tireLife > 30 ? 1.0 : Math.max(0.4, tireLife / 30);
      const carBase = (profile.carStats.enginePower + profile.carStats.aerodynamics + profile.carStats.chassis) / 300;
      const totalPerf = ((carBase * 0.5 + 0.5) * activeStrategy.perfMultiplier * tirePerf * confidenceMult);
      const difficultyThreshold = race.difficulty * 0.9;
      
      const roll = Math.random();
      let newPosition = prev.position;
      let event = "";

      if (roll > 0.88 && totalPerf > difficultyThreshold && newPosition > 1) {
        newPosition -= 1;
        event = `P${newPosition}! Aggressive move at Turn ${Math.floor(Math.random() * race.turns) + 1}.`;
        setLiveConfidence(c => Math.min(100, c + 1)); 
      } else if (roll < 0.08 && totalPerf < difficultyThreshold && newPosition < 20) { 
        newPosition += 1;
        event = "Lost position! Overtaken on the straight.";
      }

      const baseWearRate = selectedTire === TireType.SOFT ? 3.0 : selectedTire === TireType.MEDIUM ? 2.0 : 1.2;
      return {
        ...prev,
        lap: prev.lap + 1,
        position: newPosition,
        tireWear: Math.min(100, prev.tireWear + (baseWearRate * activeStrategy.wear)),
        fuelLevel: Math.max(0, prev.fuelLevel - (100/prev.totalLaps)),
        events: event ? [event, ...prev.events].slice(0, 5) : prev.events,
      };
    });
  }, [profile, race, selectedTire, strategy, liveConfidence]);

  useEffect(() => {
    if (session === 'RACE' && hasStarted && !isSimulationPaused && raceState.lap < raceState.totalLaps) {
      simTimerRef.current = setInterval(simulateLap, 800);
    } else {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    }
    return () => { if (simTimerRef.current) clearInterval(simTimerRef.current); };
  }, [hasStarted, isSimulationPaused, raceState.lap, raceState.totalLaps, simulateLap, session]);

  const initiatePit = () => {
    setIsSimulationPaused(true);
    setPitCountdown(5);
  };

  useEffect(() => {
    let timer: any;
    if (pitCountdown !== null && pitCountdown > 0) {
      timer = setTimeout(() => setPitCountdown(pitCountdown - 1), 1000);
    } else if (pitCountdown === 0) {
      setRaceState(prev => ({ 
        ...prev, 
        tireWear: 0, 
        events: [`Pit Stop: 2.8s. Released on new ${selectedTire}s.`, ...prev.events].slice(0, 5) 
      }));
      setPitCountdown(null);
      setIsSimulationPaused(false);
    }
    return () => clearTimeout(timer);
  }, [pitCountdown, selectedTire]);

  const finishRace = async () => {
    if (isFinishing) return;
    setIsFinishing(true);
    const narrative = await getRaceNarrative(profile, raceState.position, race.name);
    const points = POINTS_DISTRIBUTION[raceState.position - 1] || 0;
    onFinished({ raceName: race.name, position: raceState.position, points, narrative, driverOfTheDay: raceState.position <= 5 && Math.random() > 0.7 });
  };

  if (session === 'PRACTICE') {
      return (
          <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[100]">
              <div className="max-w-md w-full glass-card p-8 rounded-3xl text-center border-t-4 border-green-500 shadow-2xl">
                  <h2 className="text-2xl font-orbitron font-black text-white uppercase italic mb-2 tracking-tighter">Practice Session</h2>
                  {practiceProgress === 0 ? (
                      <button onClick={runPractice} className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-orbitron font-black uppercase rounded-2xl transition-all shadow-lg shadow-green-900/40">Initialize Program</button>
                  ) : (
                      <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                              <span>Telemetry Sync</span>
                              <span>{practiceProgress}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                              <div className="bg-green-500 h-full transition-all duration-300" style={{width: `${practiceProgress}%`}}></div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  if (session === 'QUALIFYING') {
      return (
        <div className="fixed inset-0 bg-black/98 flex flex-col items-center justify-center p-4 overflow-hidden z-[100]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            
            <div className="max-w-md w-full relative z-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto py-4 custom-scrollbar">
                <div className="glass-card p-5 rounded-3xl border border-white/10 flex flex-col items-center bg-black/60 shadow-2xl text-center shrink-0">
                    <h2 className="text-2xl font-orbitron font-black text-white uppercase italic leading-none mb-2">QUALIFYING</h2>
                    <div className="flex items-center space-x-3 mb-3">
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">{race.name}</span>
                        <div className="h-3 w-px bg-white/20" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center"><Navigation2 size={10} className="mr-1" /> {race.location}</span>
                    </div>
                    <div className="w-full bg-white/5 p-3 rounded-2xl border border-white/5">
                        <div className="text-[9px] font-black text-gray-500 uppercase mb-1">Session Target (Pole)</div>
                        <div className="text-xl font-mono font-bold text-white tracking-tighter">{poleTime || "--:--.---"}</div>
                    </div>
                </div>

                <div className="glass-card rounded-3xl border border-white/10 relative bg-[#080808] p-5 shadow-inner flex flex-col min-h-[300px]">
                    {qualiPhase === 'idle' ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                            <Timer size={48} className="text-yellow-500 mb-6 animate-pulse" />
                            <h3 className="text-lg font-orbitron font-bold text-white uppercase mb-6 text-sm">Initialize Flying Lap</h3>
                            <button onClick={runQualifying} className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-orbitron font-black uppercase rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center">
                                Push <FastForward size={18} className="ml-2" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-black/60 p-3 rounded-2xl border border-white/10 text-center">
                                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Delta</div>
                                    <div className={`text-xl font-mono font-bold italic tracking-tighter ${liveDelta > 0 ? 'text-red-500' : 'text-green-400'}`}>
                                        {liveDelta > 0 ? '+' : ''}{liveDelta.toFixed(3)}s
                                    </div>
                                </div>
                                <div className="bg-black/60 p-3 rounded-2xl border border-white/10 text-center">
                                    <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Sector</div>
                                    <div className="text-xl font-mono font-black text-white italic">S{qualiCurrentSector + 1}</div>
                                </div>
                            </div>

                            <div className="space-y-2 flex-1 pt-4">
                                {qualiSectors.map((time, i) => (
                                    <div key={i} className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${qualiCurrentSector === i ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-black/80 border-white/5'}`}>
                                        <span className="text-[10px] text-gray-400 font-black uppercase">Sector {i+1}</span>
                                        <span className={`font-mono text-lg font-bold ${time > 0 ? 'text-white' : 'text-gray-800'}`}>
                                            {time > 0 ? time.toFixed(3) : '--.---'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {qualiPhase === 'finished' && (
                    <div className="glass-card p-5 rounded-3xl border border-white/20 bg-black/90 animate-in slide-in-from-bottom-8">
                        <div className="flex justify-between items-center mb-5">
                            <div className="flex items-center space-x-4">
                                <div className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center font-orbitron font-black text-2xl italic">P{finalQualiPos}</div>
                                <h3 className="text-sm font-orbitron font-black text-white uppercase italic">Confirmed</h3>
                            </div>
                            <div className="text-right">
                                <div className="text-[9px] text-gray-500 font-bold uppercase">Time</div>
                                <div className="text-xl font-mono font-bold text-white">{playerTime}</div>
                            </div>
                        </div>
                        <button onClick={() => onSessionComplete({ position: finalQualiPos })} className="w-full py-4 bg-yellow-500 text-black font-orbitron font-black uppercase rounded-2xl shadow-xl">Return to Paddock</button>
                    </div>
                )}
            </div>
        </div>
      );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-inter relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 w-full max-w-lg h-full flex flex-col justify-center overflow-y-auto pb-12">
          <header className="mb-6 text-center">
            <h1 className="text-4xl font-orbitron font-black text-white uppercase italic tracking-tighter">{race.name}</h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Starting from P{initialPos}</p>
          </header>
          <div className="space-y-4 px-2">
            <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/60 shadow-xl">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Initial Engine Strategy</h3>
                <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(STRATEGIES) as StrategyKey[]).map((key) => (
                        <button key={key} onClick={() => setStrategy(key)} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${strategy === key ? `${STRATEGIES[key].bg} ${STRATEGIES[key].border} scale-105` : 'bg-white/5 border-white/5 opacity-60'}`}>
                            <span className={`text-[10px] font-black uppercase ${STRATEGIES[key].color}`}>{STRATEGIES[key].label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <button onClick={() => setHasStarted(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron font-black text-xl py-6 rounded-3xl shadow-2xl uppercase italic active:scale-95 transition-all">Drive To Grid</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col p-4 md:p-6 font-inter relative overflow-hidden">
      {/* Pit Stop Countdown Overlay (Interactive Compound Choice) */}
      {pitCountdown !== null && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            
            <h2 className="text-2xl font-orbitron font-black text-white uppercase italic mb-2">PIT STOP WINDOW OPEN</h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12">CHOOSE YOUR COMPOUND</p>
            
            <div className="text-7xl font-mono font-black text-red-600 mb-16 animate-pulse drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                {pitCountdown}s
            </div>
            
            <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
                {[TireType.SOFT, TireType.MEDIUM, TireType.HARD].map(t => (
                    <button 
                      key={t} 
                      onClick={() => setSelectedTire(t)}
                      className={`py-5 rounded-2xl border-2 font-black uppercase transition-all flex justify-between px-8 items-center ${selectedTire === t ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.2)] scale-105' : 'bg-white/5 text-gray-500 border-white/10'}`}
                    >
                        <span className="text-sm font-orbitron tracking-widest">{t}</span>
                        <div className={`w-4 h-4 rounded-full border border-black/20 ${t === TireType.SOFT ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : t === TireType.MEDIUM ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`} />
                    </button>
                ))}
            </div>
            <div className="mt-12 flex items-center space-x-2 text-[10px] text-gray-600 uppercase font-black tracking-widest">
                <Timer size={14} className="animate-spin" />
                <span>Synchronizing release with wheel guns...</span>
            </div>
        </div>
      )}

      {/* Header HUD */}
      <div className="flex justify-between items-center mb-4 relative z-40 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
        <div className="flex items-center space-x-6">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Lap</span>
            <span className="font-orbitron font-bold text-2xl text-red-500 leading-none">{raceState.lap} <span className="text-[10px] text-gray-700">/ {raceState.totalLaps}</span></span>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Status</span>
            <div className="flex items-center space-x-2 mt-0.5">{getWeatherIcon(raceState.weather)}<span className="font-bold text-xs text-white uppercase">{raceState.weather}</span></div>
          </div>
        </div>
        <div className="text-right">
            <div className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Current Position</div>
            <div className="font-orbitron font-black text-3xl italic text-white leading-none">P{raceState.position}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden relative z-40">
        <div className="lg:col-span-4 space-y-4">
           {/* Telemetry Panel */}
           <div className="glass-card p-5 rounded-3xl border border-white/10 bg-black/40 shadow-xl">
              <div className="flex justify-between items-center mb-4"><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tire Degradation</h4><span className={`text-xs font-mono font-black ${raceState.tireWear > 70 ? 'text-red-500' : 'text-green-500'}`}>{Math.round(100 - raceState.tireWear)}%</span></div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5"><div className={`h-full transition-all duration-500 ${raceState.tireWear > 70 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`} style={{ width: `${Math.max(0, 100 - raceState.tireWear)}%` }} /></div>
              <div className="flex items-center space-x-2 bg-black/60 p-2.5 rounded-xl border border-white/5">
                <div className={`w-2.5 h-2.5 rounded-full ${selectedTire === TireType.SOFT ? 'bg-red-500' : selectedTire === TireType.MEDIUM ? 'bg-yellow-500' : 'bg-white'}`} />
                <span className="text-[10px] font-black text-white uppercase">{selectedTire} Fitted</span>
              </div>
           </div>
           
           <div className="glass-card p-5 rounded-3xl border border-white/10 bg-black/40 shadow-xl">
                <div className="flex justify-between items-center mb-4"><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Driver Conditioning</h4><Heart size={14} className="text-red-500" /></div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5"><div className={`h-full transition-all ${liveCondition < 30 ? 'bg-red-600' : 'bg-blue-500'}`} style={{ width: `${liveCondition}%` }} /></div>
                <div className="flex justify-between mt-3 px-1"><span className="text-[9px] text-gray-500 font-black uppercase">Confidence Factor</span><span className="text-[9px] text-white font-mono font-bold">{Math.round(liveConfidence)}%</span></div>
           </div>

           {/* Mode Selection - Android Friendly Grid */}
           <div className="glass-card p-5 rounded-3xl border border-white/10 bg-black/40 shadow-xl">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Energy Strategy</h4>
              <div className="grid grid-cols-1 gap-2">
                {(Object.keys(STRATEGIES) as StrategyKey[]).map((key) => (
                  <button 
                    key={key} 
                    disabled={isSimulationPaused}
                    onClick={() => setStrategy(key)} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${strategy === key ? `${STRATEGIES[key].bg} ${STRATEGIES[key].border} opacity-100` : 'bg-black/20 border-white/5 opacity-40'}`}
                  >
                    <span className={`text-[10px] font-black uppercase ${STRATEGIES[key].color}`}>{STRATEGIES[key].label}</span>
                    {strategy === key && <CheckCircle size={14} className={STRATEGIES[key].color} />}
                  </button>
                ))}
              </div>
           </div>

           <div className="flex-1" />
        </div>

        {/* Central "Digital Monitor" / Terminal Feed */}
        <div className="lg:col-span-8 flex flex-col space-y-4 min-h-[400px]">
           <div className="flex-1 glass-card rounded-[40px] relative overflow-hidden bg-[#050505] border border-white/10 flex flex-col shadow-2xl p-6 md:p-10">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
              <div className="absolute top-6 left-10 right-10 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-red-500 font-mono">
                    <Cpu size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">ECU LIVE FEED • SYSTEM_OK</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 font-mono text-[9px] uppercase tracking-widest">
                    <Activity size={12} />
                    <span>Real-time Telemetry</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-end space-y-4 mt-12 mb-4">
                 <div className="text-[10px] text-gray-600 mb-2 uppercase tracking-widest font-mono italic opacity-40">Connecting to car MGU-K link... Telemetry synchronized...</div>
                 {raceState.events.map((ev, i) => (
                    <div key={i} className={`p-5 rounded-2xl text-[11px] font-mono flex items-start transition-all animate-in slide-in-from-left duration-300 ${i === 0 ? 'bg-white/5 text-white border-l-4 border-red-500 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]' : 'text-gray-500 opacity-40'}`}>
                       <span className="mr-4 text-red-500/50 shrink-0 font-bold">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                       <span className="uppercase tracking-wide leading-relaxed font-bold">{ev}</span>
                    </div>
                 ))}
              </div>
              
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-40" />
           </div>

           <div className="flex space-x-4">
              <button 
                onClick={initiatePit} 
                disabled={isSimulationPaused || raceState.lap >= raceState.totalLaps}
                className="flex-1 py-7 bg-white hover:bg-gray-200 text-black rounded-[35px] font-orbitron font-black text-xs uppercase tracking-[0.2em] disabled:opacity-20 active:scale-95 transition-all shadow-xl flex items-center justify-center border-b-4 border-gray-300"
              >
                <Wrench className="mr-3" size={18} /> BOX THIS LAP
              </button>
              {raceState.lap >= raceState.totalLaps && (
                <button onClick={finishRace} className="flex-1 py-7 bg-red-600 hover:bg-red-700 text-white font-orbitron font-black text-xs uppercase tracking-[0.2em] active:scale-95 transition-all shadow-xl shadow-red-950/40 border-b-4 border-red-900">
                    FINISH RACE
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default RaceView;
