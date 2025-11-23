import { GoogleGenAI, Type } from "@google/genai";
import { GradingResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const gradeHomeworkImage = async (base64Image: string): Promise<GradingResult> => {
  // Strip the data URL prefix if present to get just the base64 string
  const base64Data = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Data,
          },
        },
        {
          text: `You are a strict but encouraging teacher. Analyze this image of a homework assignment. 
          1. Identify the Subject (Math, English, Science, etc.).
          2. Give it a score from 0 to 100 based on accuracy.
          3. Provide a brief encouraging summary.
          4. Break down individual questions/parts you can identify. If you can't read the handwriting, mention it in the summary.
          
          Return the response in Chinese (Simplified).`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING, description: "The subject of the homework" },
          overallScore: { type: Type.NUMBER, description: "Score from 0 to 100" },
          summary: { type: Type.STRING, description: "A brief summary of the performance" },
          corrections: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionIndex: { type: Type.STRING, description: "Question number or identifier (e.g. '1', 'Q2', 'Equation')" },
                isCorrect: { type: Type.BOOLEAN, description: "True if the answer is correct" },
                studentAnswer: { type: Type.STRING, description: "What the student wrote (transcribed)" },
                correctAnswer: { type: Type.STRING, description: "The correct answer" },
                explanation: { type: Type.STRING, description: "Why it is right or wrong" },
              },
              required: ["questionIndex", "isCorrect", "studentAnswer", "correctAnswer", "explanation"],
            },
          },
        },
        required: ["subject", "overallScore", "summary", "corrections"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as GradingResult;
  }
  
  throw new Error("Failed to grade homework");
};
