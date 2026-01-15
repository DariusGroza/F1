
import React from 'react';
import { Trophy, Star, Users, ChevronRight, Award, Zap, Heart } from 'lucide-react';
import { LeagueTier, Team } from '../types';

interface CelebrationProps {
  type: 'DOTD' | 'WDC' | 'WCC';
  tier: LeagueTier;
  team?: Team | null;
  year?: number;
  onClose: () => void;
  rewards: { cash: number; sp?: number; tp?: number };
}

const CelebrationModal: React.FC<CelebrationProps> = ({ type, tier, team, year, onClose, rewards }) => {
  const isWDC = type === 'WDC';
  const isWCC = type === 'WCC';
  const isDOTD = type === 'DOTD';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      {/* Background Glows */}
      <div className={`absolute w-96 h-96 blur-[120px] rounded-full opacity-30 animate-pulse ${
        isWDC ? 'bg-yellow-500' : isWCC ? 'bg-blue-500' : 'bg-red-500'
      }`} />
      
      <div className="relative max-w-sm w-full glass-card rounded-3xl overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
        {/* Carbon Fiber Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

        <div className="relative p-8 flex flex-col items-center text-center">
          {/* Top Icon */}
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-2 animate-bounce ${
            isWDC ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 
            isWCC ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 
            'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
          }`}>
            {isWDC && <Trophy size={48} className="fill-current" />}
            {isWCC && <Users size={48} className="fill-current" />}
            {isDOTD && <Star size={48} className="fill-current" />}
          </div>

          {/* Header */}
          <h4 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${
            isWDC ? 'text-yellow-500' : isWCC ? 'text-blue-400' : 'text-red-500'
          }`}>
            {isWDC ? 'Apex World Series' : isWCC ? 'Engineering Excellence' : 'Fan Vote Result'}
          </h4>
          
          <h2 className="text-3xl font-orbitron font-black text-white uppercase italic leading-none mb-4">
            {isWDC ? 'WORLD CHAMPION' : isWCC ? 'CONSTRUCTORS CUP' : 'DRIVER OF THE DAY'}
          </h2>

          <p className="text-gray-400 text-xs mb-8 max-w-[240px]">
            {isWDC && `An immortal legacy forged in the fires of ${tier} competition. The ${year} title belongs to you.`}
            {isWCC && `The ${team?.name || 'team'} factory celebrates tonight. Your consistency secured the factory title.`}
            {isDOTD && `The fans have spoken! Your aggressive overtakes and raw pace earned you the popular vote.`}
          </p>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-3 w-full mb-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[8px] text-gray-500 font-black uppercase mb-1">Cash Bonus</span>
              <span className="text-green-400 font-mono font-bold text-sm">+${rewards.cash.toLocaleString()}</span>
            </div>
            {rewards.sp !== undefined && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="block text-[8px] text-gray-500 font-black uppercase mb-1">Skill Gain</span>
                <span className="text-blue-400 font-mono font-bold text-sm">+{rewards.sp} SP</span>
              </div>
            )}
            {rewards.tp !== undefined && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <span className="block text-[8px] text-gray-500 font-black uppercase mb-1">Tech Gain</span>
                <span className="text-red-400 font-mono font-bold text-sm">+{rewards.tp} TP</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={onClose}
            className={`w-full py-4 rounded-2xl font-orbitron font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center ${
              isWDC ? 'bg-yellow-500 text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]' : 
              isWCC ? 'bg-blue-600 text-white' : 'bg-white text-black'
            }`}
          >
            Claim Rewards <ChevronRight size={16} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationModal;
