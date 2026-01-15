
import { Team, Race, LeagueTier, AcademyId } from './types';

export const ACADEMIES: Record<AcademyId, { name: string, description: string, philosophy: string, color: string }> = {
  zenith: {
    name: "Zenith Driver Program",
    description: "The most ruthless academy. Fast track to F1 or unemployment.",
    philosophy: "Win or Die",
    color: "text-blue-500 border-blue-500"
  },
  valkyrie: {
    name: "Valkyrie Rosso Academy",
    description: "Steeped in history. They nurture talent slowly.",
    philosophy: "Loyalty & Legacy",
    color: "text-red-500 border-red-500"
  },
  spectre: {
    name: "Spectre Development",
    description: "Corporate and calculated. Precision over flair.",
    philosophy: "Precision Engineering",
    color: "text-green-500 border-green-500"
  },
  indie: {
    name: "Privateer",
    description: "No academy backing. You pay for your own seat.",
    philosophy: "Cash is King",
    color: "text-gray-400 border-gray-500"
  }
};

export const TEAMS: Team[] = [
  { id: 't1', name: 'Valkyrie Rosso', logoId: 'shield', color: '#dc2626', basePerformance: 98, tier: 'R1', academyId: 'valkyrie', seatCost: 0, marketValue: 3900000000, dividendYield: 0.005, marketTrend: 'stable' },
  { id: 't2', name: 'Silver Stars', logoId: 'hexagon', color: '#9ca3af', basePerformance: 97, tier: 'R1', academyId: 'spectre', seatCost: 0, marketValue: 3800000000, dividendYield: 0.006, marketTrend: 'down' },
  { id: 't3', name: 'Blue Bull Racing', logoId: 'skull', color: '#1e3a8a', basePerformance: 96, tier: 'R1', academyId: 'zenith', seatCost: 0, marketValue: 2600000000, dividendYield: 0.008, marketTrend: 'up' },
  { id: 't4', name: 'Papaya Speed', logoId: 'triangle', color: '#f97316', basePerformance: 95, tier: 'R1', academyId: 'indie', seatCost: 0, marketValue: 2200000000, dividendYield: 0.01, marketTrend: 'up' },
  { id: 't5', name: 'Emerald Apex', logoId: 'diamond', color: '#065f46', basePerformance: 88, tier: 'R1', academyId: 'indie', seatCost: 0, marketValue: 1400000000, dividendYield: 0.015, marketTrend: 'stable' },
  { id: 't6', name: 'Mist Racing', logoId: 'ghost', color: '#3b82f6', basePerformance: 85, tier: 'R1', academyId: 'spectre', seatCost: 0, marketValue: 1100000000, dividendYield: 0.02, marketTrend: 'down' },
  { id: 't7', name: 'Charging Bulls', logoId: 'zap', color: '#1d4ed8', basePerformance: 82, tier: 'R1', academyId: 'zenith', seatCost: 5000000, marketValue: 900000000, dividendYield: 0.025, marketTrend: 'up' },
  { id: 't8', name: 'Legacy GP', logoId: 'sword', color: '#1e40af', basePerformance: 78, tier: 'R1', academyId: 'valkyrie', seatCost: 8000000, marketValue: 800000000, dividendYield: 0.03, marketTrend: 'stable' },
  { id: 't9', name: 'Haas-ty Speed', logoId: 'skull', color: '#ef4444', basePerformance: 76, tier: 'R1', academyId: 'indie', seatCost: 12000000, marketValue: 780000000, dividendYield: 0.035, marketTrend: 'up' },
  { id: 't10', name: 'Sauber-X', logoId: 'circle', color: '#bef264', basePerformance: 74, tier: 'R1', academyId: 'indie', seatCost: 15000000, marketValue: 700000000, dividendYield: 0.04, marketTrend: 'down' },

  { id: 'r4_1', name: 'Zenith Junior', logoId: 'zap', color: '#3b82f6', basePerformance: 62, tier: 'R4', academyId: 'zenith', seatCost: 0, marketValue: 1500000, dividendYield: 0.08, marketTrend: 'up' },
  { id: 'r4_2', name: 'Valkyrie Corse', logoId: 'shield', color: '#dc2626', basePerformance: 60, tier: 'R4', academyId: 'valkyrie', seatCost: 0, marketValue: 1400000, dividendYield: 0.07, marketTrend: 'stable' },
  { id: 'r4_3', name: 'Spectre Young Guns', logoId: 'hexagon', color: '#10b981', basePerformance: 59, tier: 'R4', academyId: 'spectre', seatCost: 0, marketValue: 1300000, dividendYield: 0.075, marketTrend: 'up' },
  { id: 'r4_4', name: 'Velocity Projects', logoId: 'zap', color: '#facc15', basePerformance: 54, tier: 'R4', academyId: 'indie', seatCost: 200000, marketValue: 1100000, dividendYield: 0.09, marketTrend: 'stable' },
  { id: 'r4_5', name: 'Blackstream Racing', logoId: 'skull', color: '#444444', basePerformance: 55, tier: 'R4', academyId: 'indie', seatCost: 250000, marketValue: 1000000, dividendYield: 0.1, marketTrend: 'down' },
  { id: 'r4_6', name: 'Apex Academy', logoId: 'triangle', color: '#f87171', basePerformance: 52, tier: 'R4', academyId: 'zenith', seatCost: 0, marketValue: 950000, dividendYield: 0.11, marketTrend: 'up' },
  { id: 'r4_7', name: 'Legacy Junior', logoId: 'sword', color: '#60a5fa', basePerformance: 50, tier: 'R4', academyId: 'valkyrie', seatCost: 0, marketValue: 900000, dividendYield: 0.12, marketTrend: 'down' },
  { id: 'r4_8', name: 'Neon Dynamics', logoId: 'hexagon', color: '#c084fc', basePerformance: 48, tier: 'R4', academyId: 'spectre', seatCost: 0, marketValue: 850000, dividendYield: 0.13, marketTrend: 'up' },
  { id: 'r4_9', name: 'Prestige Karting', logoId: 'diamond', color: '#fbbf24', basePerformance: 46, tier: 'R4', academyId: 'indie', seatCost: 150000, marketValue: 800000, dividendYield: 0.14, marketTrend: 'stable' },
  { id: 'r4_10', name: 'Global Talent GP', logoId: 'globe', color: '#2dd4bf', basePerformance: 45, tier: 'R4', academyId: 'indie', seatCost: 100000, marketValue: 750000, dividendYield: 0.15, marketTrend: 'down' },
];

export const TIER_CONFIG: Record<LeagueTier, { name: string, description: string, bg: string, style: string }> = {
  R4: { name: "R4 Junior Academy", description: "The proving grounds.", bg: "bg-[url('https://images.unsplash.com/photo-1596707328576-6967527653c3?q=80&w=2070')]", style: "border-orange-500" },
  R3: { name: "R3 Regional Series", description: "Technical open-wheel racing.", bg: "bg-[url('https://images.unsplash.com/photo-1541348263662-e068662d82af?q=80&w=2574')]", style: "border-blue-500" },
  R2: { name: "R2 Challenger Cup", description: "One step away from glory.", bg: "bg-[url('https://images.unsplash.com/photo-1532906619279-a764d26210b3?q=80&w=2671')]", style: "border-purple-500" },
  R1: { name: "Apex World Series", description: "The pinnacle of motorsport.", bg: "bg-[url('https://images.unsplash.com/photo-1504198266287-1659872e6584?q=80&w=2670')]", style: "border-red-600" }
};

export const CALENDAR: Race[] = [
  { name: 'Desert Dunes GP', laps: 57, difficulty: 0.8, date: 'Mar 02', location: 'Sakhir', length: '5.412 km', turns: 15, lapRecord: '1:31.447 (M. Virstappen)', circuitType: 'Permanent', drsZones: 3 },
  { name: 'Night City GP', laps: 50, difficulty: 0.85, date: 'Mar 09', location: 'Jeddah', length: '6.174 km', turns: 27, lapRecord: '1:30.734 (L. Hamiltin)', circuitType: 'Street', drsZones: 3 },
  { name: 'Harbor Park GP', laps: 58, difficulty: 0.82, date: 'Mar 24', location: 'Melbourne', length: '5.278 km', turns: 14, lapRecord: '1:20.235 (C. Leclirc)', circuitType: 'Hybrid', drsZones: 4 },
  { name: 'Cherry Blossom GP', laps: 53, difficulty: 0.91, date: 'Apr 07', location: 'Suzuka', length: '5.807 km', turns: 18, lapRecord: '1:30.983 (L. Hamiltin)', circuitType: 'Permanent', drsZones: 1 },
  { name: 'Great Wall GP', laps: 56, difficulty: 0.88, date: 'Apr 21', location: 'Shanghai', length: '5.451 km', turns: 16, lapRecord: '1:32.238 (M. Schumacher)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Sunshine State GP', laps: 57, difficulty: 0.88, date: 'May 05', location: 'Miami', length: '5.412 km', turns: 19, lapRecord: '1:29.708 (M. Virstappen)', circuitType: 'Hybrid', drsZones: 3 },
  { name: 'Heritage Road GP', laps: 63, difficulty: 0.9, date: 'May 19', location: 'Imola', length: '4.909 km', turns: 19, lapRecord: '1:15.484 (L. Hamiltin)', circuitType: 'Permanent', drsZones: 1 },
  { name: 'Riviera GP', laps: 78, difficulty: 0.95, date: 'May 26', location: 'Monaco', length: '3.337 km', turns: 19, lapRecord: '1:12.909 (L. Hamiltin)', circuitType: 'Street', drsZones: 1 },
  { name: 'Maple Leaf GP', laps: 70, difficulty: 0.86, date: 'Jun 09', location: 'Montreal', length: '4.361 km', turns: 14, lapRecord: '1:13.078 (V. Bottis)', circuitType: 'Hybrid', drsZones: 2 },
  { name: 'Catalonia GP', laps: 66, difficulty: 0.84, date: 'Jun 23', location: 'Barcelona', length: '4.657 km', turns: 14, lapRecord: '1:16.330 (M. Virstappen)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Alpine Ring GP', laps: 71, difficulty: 0.83, date: 'Jun 30', location: 'Spielberg', length: '4.318 km', turns: 10, lapRecord: '1:05.619 (C. Saint)', circuitType: 'Permanent', drsZones: 3 },
  { name: 'British Heritage GP', laps: 52, difficulty: 0.87, date: 'Jul 07', location: 'Silverstone', length: '5.891 km', turns: 18, lapRecord: '1:27.097 (M. Virstappen)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Danube GP', laps: 70, difficulty: 0.89, date: 'Jul 21', location: 'Budapest', length: '4.381 km', turns: 14, lapRecord: '1:16.627 (L. Hamiltin)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Forest GP', laps: 44, difficulty: 0.92, date: 'Jul 28', location: 'Ardennes', length: '7.004 km', turns: 19, lapRecord: '1:46.286 (V. Bottis)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Coastal Dunes GP', laps: 72, difficulty: 0.85, date: 'Aug 25', location: 'Zandvoort', length: '4.259 km', turns: 14, lapRecord: '1:11.097 (L. Hamiltin)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Temple of Speed GP', laps: 53, difficulty: 0.81, date: 'Sep 01', location: 'Monza', length: '5.793 km', turns: 11, lapRecord: '1:21.046 (R. Barrichello)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Castle City GP', laps: 51, difficulty: 0.9, date: 'Sep 15', location: 'Baku', length: '6.003 km', turns: 20, lapRecord: '1:43.009 (C. Leclirc)', circuitType: 'Street', drsZones: 2 },
  { name: 'Lion City GP', laps: 62, difficulty: 0.94, date: 'Sep 22', location: 'Marina Bay', length: '4.940 km', turns: 19, lapRecord: '1:35.867 (L. Hamiltin)', circuitType: 'Street', drsZones: 3 },
  { name: 'Lone Star GP', laps: 56, difficulty: 0.88, date: 'Oct 20', location: 'Austin', length: '5.513 km', turns: 20, lapRecord: '1:36.169 (C. Leclirc)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'High Altitude GP', laps: 71, difficulty: 0.86, date: 'Oct 27', location: 'Mexico City', length: '4.304 km', turns: 17, lapRecord: '1:17.774 (V. Bottis)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Samba GP', laps: 71, difficulty: 0.87, date: 'Nov 03', location: 'Interlagos', length: '4.309 km', turns: 15, lapRecord: '1:10.540 (V. Bottis)', circuitType: 'Permanent', drsZones: 2 },
  { name: 'Neon Strip GP', laps: 50, difficulty: 0.93, date: 'Nov 23', location: 'Las Vegas', length: '6.201 km', turns: 17, lapRecord: '1:35.490 (O. Pastry)', circuitType: 'Street', drsZones: 2 },
  { name: 'Desert Night GP', laps: 57, difficulty: 0.84, date: 'Dec 01', location: 'Lusail', length: '5.419 km', turns: 16, lapRecord: '1:24.319 (M. Virstappen)', circuitType: 'Permanent', drsZones: 1 },
  { name: 'Twilight GP', laps: 58, difficulty: 0.82, date: 'Dec 08', location: 'Yas Marina', length: '5.281 km', turns: 16, lapRecord: '1:26.103 (M. Virstappen)', circuitType: 'Permanent', drsZones: 2 },
];

export const POINTS_DISTRIBUTION = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
