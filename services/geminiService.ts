
import { GoogleGenAI } from "@google/genai";

export const generateAIReply = async (reviewText: string, businessName: string): Promise<string> => {
  // Fix: Direct use of process.env.API_KEY as per named parameter requirement
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the manager of "${businessName}". Write a polite, professional, and empathetic response to this customer review: "${reviewText}". If the review is negative, apologize and offer to make it right. If positive, thank them and invite them back. Keep it concise.`,
    });
    
    // Correct: Accessing .text property directly
    return response.text || "Sorry, I couldn't generate a reply at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI response. Please try again.";
  }
};
