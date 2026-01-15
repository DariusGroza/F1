
export interface DriverStats {
  pace: number;
  concentration: number;
  stamina: number; // Long-term physical attribute (The Stat)
  experience: number;
  conditioning: number; // Short-term race readiness (0-100) - affected by weekly prep
  confidence: number; // Mental state (0-100) - affected by recent form/sim work
}

export interface CarStats {
  aerodynamics: number;
  enginePower: number;
  chassis: number;
  reliability: number;
}

export type LeagueTier = 'R4' | 'R3' | 'R2' | 'R1';

export type AcademyId = 'zenith' | 'valkyrie' | 'spectre' | 'indie';

export interface Team {
  id: string;
  name: string;
  logoId: string;
  color: string;
  basePerformance: number;
  tier: LeagueTier;
  academyId?: AcademyId;
  seatCost: number;
  // Finance additions
  marketValue: number; // Total value in $
  dividendYield: number; // Annual % (e.g., 0.05 = 5%), paid per race
  marketTrend: 'up' | 'down' | 'stable';
}

export interface Race {
  name: string;
  laps: number;
  difficulty: number;
  date: string;
  location: string;
  // Detailed Circuit Info
  length: string;
  turns: number;
  lapRecord: string;
  circuitType: 'Street' | 'Permanent' | 'Hybrid';
  drsZones: number;
}

export interface RaceResult {
  raceName: string;
  position: number;
  points: number;
  narrative: string;
  driverOfTheDay: boolean;
}

export interface Trophy {
  id: string;
  name: string;
  year: number;
  type: 'WDC' | 'WCC' | 'DOTD' | 'ROOKIE';
}

export interface InboxMessage {
  id: string;
  sender: string;
  role: string;
  subject: string;
  body: string;
  type: 'URGENT' | 'TECH' | 'NORMAL';
  timestamp: string;
  read: boolean;
}

export type RaceSession = 'PRACTICE' | 'QUALIFYING' | 'RACE';

export interface Investment {
  teamId: string;
  percentage: number; // Ownership % (e.g., 1.0 = 1%)
}

export interface PlayerProfile {
  id: string;
  name: string;
  nationality: string;
  age: number;
  avatarSeed: string;
  tier: LeagueTier;
  team: Team | null;
  budget: number;
  skillPoints: number;
  techPoints: number;
  careerPoints: number;
  driverStats: DriverStats;
  carStats: CarStats;
  results: RaceResult[];
  season: number;
  currentRaceIndex: number;
  currentSession: RaceSession;
  qualifyingPosition: number | null;
  trophies: Trophy[];
  lifestyle: string[];
  investments: Investment[];
  
  academyId: AcademyId;
  academyStanding: number;
  engineerRapport: number;
  teammateRelationship: number;
  isSharingData: boolean;
  
  reputation: {
    board: number;
    fans: number;
    team: number;
  };
  inbox: InboxMessage[];
  newsHeadlines: string[];
  
  lastUpdated: string;
}

export interface SaveSlot {
  id: number;
  profile: PlayerProfile | null;
}

export enum TireType {
  SOFT = 'Soft',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export type MechanicalFault = 'GEARBOX_SYNC' | 'ERS_FAIL' | 'DRS_STUCK' | 'SENSOR_TIRE' | 'SENSOR_FUEL' | 'AERO_DMG';

export interface LiveRaceState {
  lap: number;
  totalLaps: number;
  position: number;
  tireWear: number;
  fuelLevel: number;
  weather: 'Sunny' | 'Overcast' | 'Rainy';
  trackTemp: number;
  windSpeed: number;
  gapToAhead: number;
  gapToBehind: number;
  events: string[];
  faults: MechanicalFault[];
  pitStopDuration?: number;
}
