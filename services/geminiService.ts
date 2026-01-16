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
 * Parses raw text/CSV data to clean and structure it using Gemini.
 */
export const cleanDataWithAI = async (rawText: string): Promise<Member[]> => {
  if (!apiKey) return [];

  // Truncate if too huge to avoid token limits (simulated for now)
  const truncatedText = rawText.slice(0, 30000);

  const prompt = `
    You are a Data Cleaner for BNI Business Network.
    
    INPUT DATA:
    ${truncatedText}

    TASK:
    1. Extract a list of Members from the messy input.
    2. For each member, identify:
       - Name (Clean, Title Case)
       - Gives (List of specific services/products they offer. Do NOT include other people's names unless explicitly stated as a service. CLEAN UP keywords.)
       - Asks (List of what they are looking for. CLEAN UP keywords.)
    3. IGNORE headers, footers, empty rows, or rows that don't look like member data.
    4. STRICT RULE: "Gives" and "Asks" must be services/products/industries. If the input has "Manish (Builder)", the Give is "Builder", not "Manish". Remove names of other people.
    
    Output a JSON array of Member objects.
    Schema: { name: string, gives: string[], asks: string[] }[]
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp', // Fast model for parsing
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              gives: { type: Type.ARRAY, items: { type: Type.STRING } },
              asks: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['name', 'gives', 'asks']
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];

    // transform to Member type (partial)
    const rawData = JSON.parse(text) as { name: string, gives: string[], asks: string[] }[];

    return rawData.map((d, i) => ({
      id: `ai-clean-${i}`,
      name: d.name,
      company: 'BNI Member', // Default, will be enriched later
      industry: 'General' as unknown as Member['industry'], // Fix type compatibility by casting
      specialty: 'Member', // Default
      gives: d.gives,
      asks: d.asks,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=random&color=fff`,
      email: '',
      phoneNumber: ''
    } as Member));

  } catch (error) {
    console.error("Gemini Cleaning Error", error);
    return [];
  }
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

  // Optimize context: We ONLY care about other members' *GIVES*.
  // We want to find who GIVES what the target ASKS.
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
    5. **CRITICAL**: ONLY match "Target's ASK" with "Candidate's GIVE". Do NOT look at Candidate's ASKS.

    Output a JSON array of match objects.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
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
