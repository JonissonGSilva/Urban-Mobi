
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface RiskAnalysisResponse {
  score: number;
  recommendations: string[];
  factors: {
    weather: number;
    traffic: number;
    events: number;
  };
}

export const getRiskAnalysis = async (
  context: string = "Normal weekday afternoon in a busy metropolitan city"
): Promise<RiskAnalysisResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a mobility risk analysis (0-100 score) for the following context: ${context}. Return the result in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Total risk score from 0 to 100" },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Actionable recommendations for the commuter"
            },
            factors: {
              type: Type.OBJECT,
              properties: {
                weather: { type: Type.NUMBER, description: "Risk contribution from weather (0-30)" },
                traffic: { type: Type.NUMBER, description: "Risk contribution from traffic (0-30)" },
                events: { type: Type.NUMBER, description: "Risk contribution from public events (0-20)" }
              },
              required: ["weather", "traffic", "events"]
            }
          },
          required: ["score", "recommendations", "factors"]
        }
      }
    });

    return JSON.parse(response.text || "{}") as RiskAnalysisResponse;
  } catch (error) {
    console.error("Gemini risk analysis failed:", error);
    // Fallback
    return {
      score: 45,
      recommendations: ["Stay updated with traffic alerts", "Consider public transport"],
      factors: { weather: 15, traffic: 20, events: 10 }
    };
  }
};
