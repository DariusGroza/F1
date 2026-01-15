
import React, { useState, useEffect } from 'react';
import { PlayerProfile, SaveSlot, Team, RaceResult, Trophy, AcademyId, InboxMessage, RaceSession, LeagueTier } from './types';
import { TEAMS, CALENDAR, POINTS_DISTRIBUTION } from './constants';
import Hub from './components/Hub';
import RaceView from './components/RaceView';
import SetupScreen from './components/SetupScreen'; 
import LandingPage from './components/LandingPage';
import CharacterCreation from './components/CharacterCreation';
import CelebrationModal from './components/CelebrationModals';
import { Save, AlertTriangle, XCircle, CheckCircle, HelpCircle } from 'lucide-react';

const INITIAL_SLOTS: SaveSlot[] = [
  { id: 1, profile: null },
  { id: 2, profile: null },
  { id: 3, profile: null },
  { id: 4, profile: null },
];

const DECISION_EVENTS = [
  { text: "Your mechanics are exhausted. Give them a bonus?", optionA: "Yes (-$5k, +Morale)", optionB: "No (Save money)", costA: 5000, effectA: "team", effectB: "budget" },
  { text: "A sponsor wants a photoshoot during your rest day.", optionA: "Do it (+$10k, -Condition)", optionB: "Decline (+Condition)", costA: -10000, effectA: "budget", effectB: "condition" },
  { text: "Teammate asks for setup data.", optionA: "Share it (+Relationship)", optionB: "Keep it secret (+Rivalry)", costA: 0, effectA: "relationship", effectB: "rivalry" },
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'landing' | 'creation' | 'hub' | 'racing' | 'decision'>('landing');
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>(INITIAL_SLOTS);
  const [activeSlotId, setActiveSlotId] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [currentDecision, setCurrentDecision] = useState<any>(null);

  // Celebration States
  const [activeCelebration, setActiveCelebration] = useState<{
    type: 'DOTD' | 'WDC' | 'WCC';
    rewards: { cash: number; sp?: number; tp?: number };
  } | null>(null);
  const [pendingCelebrations, setPendingCelebrations] = useState<any[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('apex_racing_saves');
    if (savedData) {
      try { setSaveSlots(JSON.parse(savedData)); } catch (e) { console.error("Failed to load saves", e); }
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const persistData = (slots: SaveSlot[]) => {
    localStorage.setItem('apex_racing_saves', JSON.stringify(slots));
    setHasUnsavedChanges(false);
  };

  const handleManualSave = () => {
    persistData(saveSlots);
    showNotification("Game Saved Successfully");
  };

  const attemptExit = () => {
    if (hasUnsavedChanges) setShowExitModal(true);
    else { setGameState('landing'); setActiveSlotId(null); }
  };

  const confirmExitWithoutSaving = () => {
    const savedData = localStorage.getItem('apex_racing_saves');
    if (savedData) setSaveSlots(JSON.parse(savedData));
    setHasUnsavedChanges(false); setShowExitModal(false); setGameState('landing'); setActiveSlotId(null);
  };

  const saveAndExit = () => { handleManualSave(); setShowExitModal(false); setGameState('landing'); setActiveSlotId(null); };

  const handleStartNew = (slotId: number) => { setActiveSlotId(slotId); setGameState('creation'); };
  const handleLoad = (slotId: number) => { const slot = saveSlots.find(s => s.id === slotId); if (slot && slot.profile) { setActiveSlotId(slotId); setGameState('hub'); setHasUnsavedChanges(false); } };
  const handleDelete = (slotId: number) => { const newSlots = saveSlots.map(slot => slot.id === slotId ? { ...slot, profile: null } : slot); setSaveSlots(newSlots); persistData(newSlots); };

  const handleCreateProfile = (name: string, nationality: string, avatarSeed: string, academyId: AcademyId, startingTeamId: string) => {
    if (activeSlotId === null) return;
    const startTeam = TEAMS.find(t => t.id === startingTeamId) || TEAMS[0];
    const newProfile: PlayerProfile = {
      id: crypto.randomUUID(), name, nationality, age: 16, avatarSeed, tier: 'R4', team: startTeam, budget: 50000, 
      skillPoints: 0, techPoints: 0, careerPoints: 0, driverStats: { pace: 40, concentration: 40, stamina: 50, experience: 0, conditioning: 100, confidence: 80 },
      carStats: { aerodynamics: 30, enginePower: 30, chassis: 30, reliability: 60 }, results: [], season: 2024, currentRaceIndex: 0, currentSession: 'PRACTICE', qualifyingPosition: null, trophies: [], lifestyle: [], investments: [],
      academyId, academyStanding: 50, engineerRapport: 50, teammateRelationship: 50, isSharingData: true, reputation: { board: 50, fans: 0, team: 50 }, inbox: [], newsHeadlines: [], lastUpdated: new Date().toISOString()
    };
    const newSlots = saveSlots.map(slot => slot.id === activeSlotId ? { ...slot, profile: newProfile } : slot);
    setSaveSlots(newSlots); persistData(newSlots); setGameState('hub');
  };

  const updateProfile = (updatedProfile: PlayerProfile) => {
    setSaveSlots(prev => prev.map(slot => slot.id === activeSlotId ? { ...slot, profile: updatedProfile } : slot));
    setHasUnsavedChanges(true);
  };

  const handleStartRace = () => { persistData(saveSlots); setGameState('racing'); };

  const handleSessionComplete = (results: any) => {
    if (activeSlotId === null) return;
    const currentProfile = saveSlots.find(s => s.id === activeSlotId)?.profile;
    if (!currentProfile) return;
    let updatedProfile = { ...currentProfile };
    if (currentProfile.currentSession === 'PRACTICE') {
       updatedProfile.driverStats.confidence = Math.min(100, updatedProfile.driverStats.confidence + (results.confidenceBoost || 0));
       updatedProfile.driverStats.conditioning = Math.min(100, updatedProfile.driverStats.conditioning + (results.conditionBoost || 0));
       updatedProfile.currentSession = 'QUALIFYING';
    } else if (currentProfile.currentSession === 'QUALIFYING') {
       updatedProfile.qualifyingPosition = results.position;
       updatedProfile.currentSession = 'RACE';
    }
    updateProfile(updatedProfile);
    setGameState('hub');
  };

  const nextCelebration = () => {
    if (pendingCelebrations.length > 0) {
      const [next, ...rest] = pendingCelebrations;
      setActiveCelebration(next);
      setPendingCelebrations(rest);
    } else {
      setActiveCelebration(null);
      // Once all celebrations are over, move to decision
      setCurrentDecision(DECISION_EVENTS[Math.floor(Math.random() * DECISION_EVENTS.length)]);
      setGameState('decision');
    }
  };

  const handleRaceFinished = (result: RaceResult) => {
    if (activeSlotId === null) return;
    const currentProfile = saveSlots.find(s => s.id === activeSlotId)?.profile;
    if (!currentProfile) return;

    const tierMultipliers = { R4: 1, R3: 5, R2: 20, R1: 100 };
    const tierMultiplier = tierMultipliers[currentProfile.tier] || 1;
    const finishPrize = Math.max(0, (21 - result.position) * 2000 * tierMultiplier);

    let dividendIncome = 0;
    if (currentProfile.investments) {
        currentProfile.investments.forEach(inv => {
            const team = TEAMS.find(t => t.id === inv.teamId);
            if (team) dividendIncome += (team.marketValue * (inv.percentage / 100) * team.dividendYield) / 21;
        });
    }

    const celebrations = [];

    // DOTD Check
    if (result.driverOfTheDay) {
      celebrations.push({
        type: 'DOTD',
        rewards: { cash: 1500 * tierMultiplier, sp: 1 }
      });
    }

    let updatedProfile = {
      ...currentProfile,
      results: [...currentProfile.results, result],
      currentRaceIndex: currentProfile.currentRaceIndex + 1,
      currentSession: 'PRACTICE' as RaceSession,
      qualifyingPosition: null,
      budget: currentProfile.budget + finishPrize + dividendIncome + (result.driverOfTheDay ? 1500 * tierMultiplier : 0),
      careerPoints: currentProfile.careerPoints + result.points,
      techPoints: currentProfile.techPoints + (currentProfile.isSharingData ? 2 : 1),
      skillPoints: currentProfile.skillPoints + (result.position <= 10 ? 1 : 0) + (result.driverOfTheDay ? 1 : 0),
      lastUpdated: new Date().toISOString()
    };
    
    // Season End
    if (updatedProfile.currentRaceIndex >= CALENDAR.length) {
       const avgPos = updatedProfile.results.reduce((acc, r) => acc + r.position, 0) / updatedProfile.results.length;
       const winThreshold = (25 * CALENDAR.length) * 0.7;

       if (avgPos < 3.5 || updatedProfile.careerPoints > winThreshold) {
          celebrations.push({
            type: 'WDC',
            rewards: { cash: 50000 * tierMultiplier, sp: 10 }
          });
          updatedProfile.budget += 50000 * tierMultiplier;
          updatedProfile.skillPoints += 10;
          updatedProfile.trophies.push({ id: `WDC_${updatedProfile.season}`, name: `${updatedProfile.tier} Champion`, year: updatedProfile.season, type: 'WDC' });
       }

       if (avgPos < 5) {
          celebrations.push({
            type: 'WCC',
            rewards: { cash: 30000 * tierMultiplier, tp: 10 }
          });
          updatedProfile.budget += 30000 * tierMultiplier;
          updatedProfile.techPoints += 10;
          updatedProfile.trophies.push({ id: `WCC_${updatedProfile.season}`, name: `${updatedProfile.tier} Constructor`, year: updatedProfile.season, type: 'WCC' });
       }

       updatedProfile.season += 1;
       updatedProfile.currentRaceIndex = 0;
       updatedProfile.careerPoints = 0;
       updatedProfile.results = [];
    }

    updateProfile(updatedProfile);
    
    if (celebrations.length > 0) {
      const [first, ...rest] = celebrations;
      setActiveCelebration(first);
      setPendingCelebrations(rest);
    } else {
      setCurrentDecision(DECISION_EVENTS[Math.floor(Math.random() * DECISION_EVENTS.length)]);
      setGameState('decision');
    }
  };

  const handleDecision = (choice: 'A' | 'B') => {
      if (!currentDecision || !activeSlotId) return;
      const currentProfile = saveSlots.find(s => s.id === activeSlotId)?.profile;
      if (!currentProfile) return;
      let updatedProfile = { ...currentProfile };
      updatedProfile.budget -= (choice === 'A' ? currentDecision.costA : 0);
      updateProfile(updatedProfile);
      setGameState('hub');
  };

  const activeProfile = saveSlots.find(s => s.id === activeSlotId)?.profile;

  return (
    <>
      {notification && <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4"><div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center border border-green-400 font-bold uppercase tracking-wider text-xs"><CheckCircle size={16} className="mr-2" />{notification}</div></div>}
      
      {activeCelebration && activeProfile && (
        <CelebrationModal 
          type={activeCelebration.type}
          tier={activeProfile.tier}
          team={activeProfile.team}
          year={activeProfile.season}
          rewards={activeCelebration.rewards}
          onClose={nextCelebration}
        />
      )}

      {gameState === 'decision' && currentDecision && <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"><div className="max-w-md w-full glass-card p-6 rounded-2xl"><h2 className="text-xl font-orbitron font-black uppercase text-yellow-500 mb-4">Post-Race Decision</h2><p className="text-lg text-white font-bold mb-6">{currentDecision.text}</p><div className="space-y-3"><button onClick={() => handleDecision('A')} className="w-full p-4 bg-white/10 rounded-xl text-left border border-white/20"><div className="font-bold text-white uppercase text-sm">Option A</div><div className="text-gray-400 text-xs">{currentDecision.optionA}</div></button><button onClick={() => handleDecision('B')} className="w-full p-4 bg-white/10 rounded-xl text-left border border-white/20"><div className="font-bold text-white uppercase text-sm">Option B</div><div className="text-gray-400 text-xs">{currentDecision.optionB}</div></button></div></div></div>}
      {showExitModal && <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4"><div className="bg-slate-900 border border-red-500 rounded-2xl max-w-sm w-full p-6"><h2 className="text-xl font-orbitron font-black text-red-500 mb-4">Unsaved Changes</h2><p className="text-gray-300 text-sm mb-8">Progress will be lost if you leave without saving.</p><div className="flex flex-col space-y-3"><button onClick={saveAndExit} className="w-full py-4 bg-green-600 text-white font-black rounded-xl">Save & Exit</button><button onClick={confirmExitWithoutSaving} className="w-full py-3 bg-red-900/30 text-red-400 rounded-xl">Exit Without Saving</button><button onClick={() => setShowExitModal(false)} className="w-full py-3 text-gray-500">Cancel</button></div></div></div>}
      {gameState === 'landing' && <LandingPage saveSlots={saveSlots} onStartNew={handleStartNew} onLoad={handleLoad} onDelete={handleDelete} />}
      {gameState === 'creation' && <CharacterCreation onComplete={handleCreateProfile} onCancel={() => setGameState('landing')} />}
      {gameState === 'hub' && activeProfile && <Hub profile={activeProfile} setProfile={updateProfile} onStartRace={handleStartRace} onSave={handleManualSave} onExit={attemptExit} hasUnsavedChanges={hasUnsavedChanges} />}
      {gameState === 'racing' && activeProfile && <RaceView profile={activeProfile} race={CALENDAR[activeProfile.currentRaceIndex]} session={activeProfile.currentSession} onFinished={handleRaceFinished} onSessionComplete={handleSessionComplete} />}
    </>
  );
};

export default App;
