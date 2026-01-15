import React from 'react';
import { PlayerProfile, Team } from '../types';
import { TEAMS } from '../constants';
import { Trophy, Zap, ShieldAlert } from 'lucide-react';

interface Props {
  profile: PlayerProfile;
  onSelectTeam: (team: Team) => void;
}

const SetupScreen: React.FC<Props> = ({ profile, onSelectTeam }) => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <header className="max-w-6xl mx-auto mb-12">
        <h2 className="text-xs font-black text-red-600 tracking-[0.4em] uppercase mb-2">Contract Negotiations</h2>
        <h1 className="text-4xl font-orbitron font-black text-white uppercase italic">Choose Your Team</h1>
        <p className="text-gray-400 mt-2">Welcome, <span className="text-red-500 font-bold">{profile.name}</span>. Every journey starts with a signature.</p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAMS.map(team => (
          <div 
            key={team.id}
            onClick={() => onSelectTeam(team)}
            className="group relative cursor-pointer glass-card p-6 rounded-xl hover:bg-white/10 transition-all border-l-4 overflow-hidden"
            style={{ borderLeftColor: team.color }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Trophy size={100} />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                team.tier === 'R1' ? 'bg-yellow-500/20 text-yellow-500' : 
                team.tier === 'R2' ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-500'
              }`}>
                TIER {team.tier}
              </span>
              <span className="text-xs font-mono text-gray-400">PERF: {team.basePerformance}%</span>
            </div>

            <h3 className="text-xl font-orbitron font-bold mb-4">{team.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <Zap size={14} className="mr-2 text-yellow-500" />
                <span>Title Contender Potential</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <ShieldAlert size={14} className="mr-2 text-green-500" />
                <span>Secure Contract</span>
              </div>
            </div>

            <button className="w-full py-2 bg-white/10 group-hover:bg-white text-white group-hover:text-black font-bold rounded transition-colors text-sm uppercase tracking-widest">
              Sign Contract
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetupScreen;