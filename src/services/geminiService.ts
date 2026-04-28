
import { GoogleGenAI, Type } from "@google/genai";
import { TOYS, Toy } from "../data/mockData";

const API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;

export const getGemini = () => {
  if (!ai) {
    if (!API_KEY) {
      console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
      return null;
    }
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
  return ai;
};

export interface RecommendationResponse {
  advice: string;
  recommendedToyIds: string[];
}

export const getToyRecommendations = async (userInput: string): Promise<RecommendationResponse> => {
  const genAI = getGemini();
  if (!genAI) {
    throw new Error("AI service not configured");
  }

  const toysContext = TOYS.map(t => ({
    id: t.id,
    name: t.name,
    ageRange: t.ageRange,
    category: t.category,
    description: t.shortDescription
  }));

  const systemInstruction = `
    You are an expert Child Developmental Psychologist and Toy Expert for "PlayPro", a premium toy rental service.
    Your goal is to help parents find the perfect toys for their children based on their needs, child's age, or developmental goals.
    
    Available Toys: ${JSON.stringify(toysContext)}
    
    Rules:
    1. Provide empathetic and professional advice for the parent.
    2. Recommend exactly 1-2 toys from the list above that best fit the description.
    3. Return your response in JSON format.
  `;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userInput,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.STRING,
              description: "Empathetic developmental advice for the parent."
            },
            recommendedToyIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of recommended toy IDs."
            }
          },
          required: ["advice", "recommendedToyIds"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as RecommendationResponse;
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    throw error;
  }
};
