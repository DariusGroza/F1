
import { GoogleGenAI } from "@google/genai";
import { PlayerProfile, LiveRaceState } from "../types";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Rules for Naming in the "Apex Universe":
 * - FIA -> IFA
 * - Pirelli -> Pirellio
 * - F1 -> Apex Series or Formula Pro
 * - Red Bull -> Blue Bull
 * - Ferrari -> Valkyrie Rosso
 * - Mercedes -> Silver Stars
 * - Hamilton -> Hamiltin
 * - Verstappen -> Virstappen
 * - Shell -> Shale
 * - Petronas -> Petronis
 */

export const getRaceNarrative = async (profile: PlayerProfile, position: number, raceName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a commentator for the "Apex World Series". Describe the performance of driver ${profile.name} at the ${raceName}. They finished P${position}. The driver is with team ${profile.team?.name}. 
      
      CRITICAL RULE: Never use real-world driver, team, or sponsor names. 
      Use twisted versions: e.g., 'Virstappen' not 'Verstappen', 'Hamiltin' not 'Hamilton', 'Valkyrie Rosso' not 'Ferrari', 'Pirellio' not 'Pirelli', 'IFA' not 'FIA'. 
      Keep it short and exciting (2-3 sentences).`,
    });
    return response.text || "A standard performance in a tough field.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The race concluded with a solid result for the team.";
  }
};

export const getEngineerRadio = async (
  raceState: LiveRaceState, 
  carReliability: number,
  currentStrategy: string,
  lastEvent: string
) => {
  try {
    const prompt = `
      Role: Professional Race Engineer in the Apex Series.
      Task: Send a 1-sentence radio message to your driver.
      
      Context:
      - Lap: ${raceState.lap}/${raceState.totalLaps}
      - Position: P${raceState.position}
      - Gap Ahead: ${raceState.gapToAhead.toFixed(1)}s
      - Gap Behind: ${raceState.gapToBehind.toFixed(1)}s
      - Tire Wear: ${Math.round(raceState.tireWear)}%
      - Fuel: ${Math.round(raceState.fuelLevel)}%
      - Weather: ${raceState.weather}
      - Active Strategy: ${currentStrategy}
      - Car Reliability: ${carReliability}%
      - Recent Event: "${lastEvent}"

      Rules:
      - Never use real names (FIA, Pirelli, Mercedes). Use 'IFA', 'Pirellio', 'Silver Stars'.
      - Use motorsport terminology (box, undercut, overcut, delta, lift and coast, purple sector).
      - Tone: Professional and urgent.
      - Keep it short (max 15 words).
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Copy that. Keep your head down and push.";
  } catch (error) {
    return "Radio check. Focus on the race.";
  }
};
