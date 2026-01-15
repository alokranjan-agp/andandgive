import { GoogleGenAI, Type } from "@google/genai";
import { Member } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface SmartMatch {
  member: string;       // Name of the candidate
  give: string;        // Candidate's Give
  matchingAsk: string; // Target's Ask
  score: number;
  reason: string;
}

/**
 * Uses Gemini with Google Search Grounding to find verified matches.
 */
export const findMemberMatches = async (
  targetMember: Member,
  candidates: Member[]
): Promise<SmartMatch[]> => {
  if (!apiKey) {
    console.warn("No API Key provided");
    return [];
  }

  // Filter out self
  const otherMembers = candidates.filter(c => c.name !== targetMember.name);
  
  // Optimize context: Only send necessary fields. 
  // We are finding who GIVES what the target ASKS.
  const candidateContext = otherMembers.map(c => ({
    name: c.name,
    gives: c.gives
  }));

  const prompt = `
    I am looking for business networking matches.
    
    TARGET MEMBER: "${targetMember.name}"
    TARGET ASKS (What they are looking for): ${JSON.stringify(targetMember.asks)}

    CANDIDATES (Other members and what they GIVE/OFFER):
    ${JSON.stringify(candidateContext)}

    TASK:
    Identify Candidates who GIVE something that satisfies one of the Target's ASKS.
    
    REQUIREMENTS:
    1. **USE GOOGLE SEARCH**: You MUST use the googleSearch tool to verify the companies, products, or services mentioned. 
       - If a candidate gives "Bharti Axa Life", verify that it is an "Insurance" company if the target asks for "Insurance".
       - If a candidate gives "XYZ Corp", find out what they do to see if it matches the Ask.
       - Use search to avoid "fake" or "hallucinated" associations.
    2. **SEMANTIC MATCHING**: Match based on meaning, not just keywords (e.g., "Web Dev" matches "Website needed").
    3. **REASONING**: Provide a short, specific reason (max 15 words) citing the search finding if relevant (e.g., "Google Search confirms XYZ Corp provides legal services").
    4. **SCORE**: Assign a confidence score (0-100). Only return matches with score > 60.

    Output a JSON array of match objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              member: { type: Type.STRING },
              give: { type: Type.STRING },
              matchingAsk: { type: Type.STRING },
              score: { type: Type.NUMBER },
              reason: { type: Type.STRING }
            },
            required: ['member', 'give', 'matchingAsk', 'score', 'reason']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as SmartMatch[];
    return data.sort((a, b) => b.score - a.score);

  } catch (error) {
    console.error("Gemini Match Error:", error);
    return [];
  }
};
