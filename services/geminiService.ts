
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

// Standardizing model names as per guidelines
const TEXT_MODEL = 'gemini-3-flash-preview';
const VIDEO_MODEL = 'veo-3.1-fast-generate-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export const getGeminiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateScript = async (topic: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: `Write a 30-second viral short-form video script about: ${topic}. 
               Format it with visual descriptions and narrator lines. 
               Keep it high energy and engaging.`,
  });
  return response.text;
};

export const generateVideo = async (prompt: string, onProgress?: (msg: string) => void) => {
  const ai = getGeminiClient();
  
  if (onProgress) onProgress("Initializing video generation engine...");
  
  let operation = await ai.models.generateVideos({
    model: VIDEO_MODEL,
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '9:16'
    }
  });

  while (!operation.done) {
    if (onProgress) onProgress("Processing frames... This usually takes 1-3 minutes.");
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed - no URI returned.");
  
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await videoResponse.blob();
  return URL.createObjectURL(blob);
};

export const generateThumbnail = async (prompt: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: `A vibrant, high-contrast YouTube/TikTok style thumbnail for a video about: ${prompt}. No text in image.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "9:16"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image data found in response");
};
