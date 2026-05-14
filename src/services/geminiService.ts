
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Toy } from "../data/mockData";

const API_KEY = process.env.GEMINI_API_KEY;

let ai: GoogleGenerativeAI | null = null;

export const getGemini = () => {
  if (!ai) {
    if (!API_KEY) {
      console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
      return null;
    }
    ai = new GoogleGenerativeAI(API_KEY);
  }
  return ai;
};

// --- AI Agent Tools ---

const searchToysTool = {
  name: "search_toys",
  description: "Search for toys in the PlayPro library based on age, category, or keywords.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      query: { type: SchemaType.STRING, description: "Keywords like 'puzzle', 'wooden', 'blocks'" },
      ageRange: { type: SchemaType.STRING, description: "Target age range like '0-3 years', '3-5 years', etc." },
      category: { type: SchemaType.STRING, description: "Category like 'Puzzles', 'Flashcards', 'STEM'" }
    }
  }
};

const addToyToBoxTool = {
  name: "add_toy_to_box",
  description: "Add a specific toy to the user's current rental box selection.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      toyId: { type: SchemaType.STRING, description: "The unique ID of the toy to add." },
      toyName: { type: SchemaType.STRING, description: "The name of the toy for confirmation." }
    },
    required: ["toyId", "toyName"]
  }
};

const getPoliciesTool = {
  name: "get_service_policies",
  description: "Get information about shipping, delivery, sanitization, and returns.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      topic: { 
        type: SchemaType.STRING, 
        enum: ["shipping", "sanitization", "returns", "pricing"],
        description: "The specific policy topic to check." 
      }
    },
    required: ["topic"]
  }
};

export const createPlayProAgent = () => {
  const genAI = getGemini();
  if (!genAI) {
    console.error("PlayPro Agent: Gemini AI not initialized (missing API key?)");
    return null;
  }

  const systemInstruction = `
    You are the "PlayPro AI Concierge" - an expert Child Developmental Specialist.
    
    KNOWLEDGE BASE:
    - SANITIZATION: Medical-grade UV sterilization for EVERY toy.
    - DELIVERY: 48-hour delivery once a box is finalized.
    - PRICING: Basic (₹999), Pro (₹1799), Premium (₹2499).
    - RETURNS: No-hassle monthly swaps.
    
    YOUR CAPABILITIES:
    1. Recommendation: Help parents find toys. ALWAYS use "search_toys" to check inventory.
    2. Actions: If a user likes a toy, use "add_toy_to_box" to add it to their selection.
    3. Support: Answer questions about shipping or safety using "get_service_policies".
    
    TONE: Helpful, professional, and empathetic.
  `;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction,
      tools: [{ 
        functionDeclarations: [searchToysTool, addToyToBoxTool, getPoliciesTool] as any
      }]
    });
    
    return model.startChat();
  } catch (error) {
    console.error("Failed to create chat session:", error);
    return null;
  }
};

export interface RecommendationResponse {
  advice: string;
  recommendedToyIds: string[];
}

export const getToyRecommendations = async (userInput: string, toys: Toy[]): Promise<RecommendationResponse> => {
  const genAI = getGemini();
  if (!genAI) throw new Error("AI service not configured");

  const toysContext = toys.map(t => ({
    id: t.id,
    name: t.name,
    ageRange: t.ageRange,
    category: t.category,
    description: t.shortDescription
  }));

  const systemInstruction = `
    You are an expert for "PlayPro".
    Recommend 1-2 toys from this exact list: ${JSON.stringify(toysContext.slice(0, 15))}
    Return JSON with 'advice' and 'recommendedToyIds'.
  `;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            advice: { type: SchemaType.STRING },
            recommendedToyIds: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
          },
          required: ["advice", "recommendedToyIds"]
        }
      }
    });

    const result = await model.generateContent(userInput);
    const response = await result.response;
    return JSON.parse(response.text() || "{}");
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);
    return { advice: "I recommend checking our top toys!", recommendedToyIds: [] };
  }
};
