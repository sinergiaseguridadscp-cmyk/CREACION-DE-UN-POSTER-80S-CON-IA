
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMoviePoster = async (base64Image: string, movieTitle: string): Promise<string> => {
  const ai = getAI();
  
  // Clean base64 string
  const base64Data = base64Image.split(',')[1] || base64Image;

  const prompt = `Create a highly detailed hand-painted movie poster in the classic 80s/90s cinematic style, inspired by the works of Drew Struzan (Indiana Jones, Blade Runner, Star Wars, The Goonies).

MAIN CHARACTER INSTRUCTIONS:
- The central protagonist is the EXACT man from the reference photo (bald, black glasses, goatee, smiling).
- DO NOT change his facial features or age. Keep his likeness perfectly preserved.
- Place him in the center in a dynamic action pose.
- Dress him in a long, futuristic coat/duster.
- He is wielding a high-tech futuristic weapon.

COMPOSITION & ART STYLE:
- Hand-painted texture with expressive brushstrokes and brilliant highlights.
- Surround the main hero with smaller painted portraits of secondary characters to create depth and a rich narrative feel.
- Include subtle story elements at the edges: a glowing ancient artifact, a sleek spaceship, and a futuristic motorcycle.

ENVIRONMENT & LIGHTING:
- Background is a blend of a rainy cyberpunk metropolis (neon blues, purples, reds) and majestic ancient ruins (warm amber and glowing gold).
- Intense directional lighting: Warm golden/amber glow from one side and cold magenta/violet/neon-blue glow from the other side.
- Deep purple shadows and atmospheric effects: rain, dust particles, smoke, and cinematic light flares.

TYPOGRAPHY & TITLE:
- At the very bottom of the poster, include the movie title in bold, high-contrast, 80s-style cinematic letters: "${movieTitle}".
- The title should look like a professional movie logo.

COLORS: Intense reds, deep violets, rich golds, with electric blue and neon green accents for energy. 
The overall atmosphere must be epic, emotional, and nostalgic—a lost 80s masterpiece.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Data,
            },
          },
          {
            text: prompt
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image was generated in the response.");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
