import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, UserCategory } from "../types";

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  if (transactions.length === 0) return "Add some transactions first so I can analyze your spending habits!";

  const transactionSummary = transactions
    .map(t => `${t.date}: ${t.type === 'expense' ? '-' : '+'}$${t.amount} (${t.category}) - ${t.note}`)
    .join('\n');

  // Fix: Initialize GoogleGenAI instance right before the call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `I have the following transactions:\n${transactionSummary}\n\nAct as a professional personal finance advisor. Analyze these spending habits and provide 3 concise, actionable tips to improve my financial health. Keep it friendly and mobile-app styled.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble analyzing your data right now. Please try again later.";
  }
};

export const suggestCategory = async (note: string, categories: UserCategory[]) => {
  // Fix: Initialize GoogleGenAI instance right before the call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const catList = categories.map(c => c.name).join(', ');
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Categorize this expense note into one of the following existing categories: ${catList}. Note: "${note}". Return only the category name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          },
          required: ["category"]
        }
      }
    });
    const text = response.text;
    if (!text) return categories[categories.length - 1].name;
    const result = JSON.parse(text.trim());
    
    // Ensure suggested category exists in user categories
    const exists = categories.find(c => c.name.toLowerCase() === result.category.toLowerCase());
    return exists ? exists.name : categories[categories.length - 1].name;
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return categories[categories.length - 1].name;
  }
};