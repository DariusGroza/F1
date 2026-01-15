
import React from 'react';
import { ChevronLeft, Flag, TrendingUp, Zap } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Tutorial: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="max-w-4xl w-full glass-card p-8 rounded-2xl animate-in slide-in-from-right">
      <div className="flex items-center mb-8">
        <button onClick={onBack} className="mr-4 p-2 bg-white/10 rounded-full hover:bg-white/20">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-orbitron font-black uppercase">Driver Handbook</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <Flag className="text-red-500 mb-4" size={32} />
          <h3 className="font-bold uppercase text-lg mb-2">Career Progression</h3>
          <p className="text-sm text-gray-400">
            Start at 16 years old in the R4 Tier. Earn good results to get promoted to R3, R2, and finally the R1 World Championship.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <TrendingUp className="text-blue-500 mb-4" size={32} />
          <h3 className="font-bold uppercase text-lg mb-2">Development</h3>
          <p className="text-sm text-gray-400">
            Earn Skill Points to improve your driving and Tech Points to upgrade your car. Invest wisely to beat your rivals.
          </p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
          <Zap className="text-yellow-500 mb-4" size={32} />
          <h3 className="font-bold uppercase text-lg mb-2">Race Strategy</h3>
          <p className="text-sm text-gray-400">
            Manage tires, fuel, and risk. Use the radio to communicate with your engineer. Weather can change everything.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
