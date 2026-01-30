
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ProductExtraction, GeneratedCopy } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  /**
   * Use Gemini 3 Pro with Google Search to extract info from URLs.
   */
  async extractProductInfo(urls: string[], category: string): Promise<ProductExtraction[]> {
    const prompt = `
      Act as a market researcher. Visit the following product URLs and extract detailed information for each.
      Category: ${category}
      URLs:
      ${urls.join('\n')}

      For each URL, identify:
      1. Product Name
      2. Price (with currency)
      3. Short Description
      4. Key Features (List)
      5. Physical Dimensions
      6. Weight
      7. Inventory/Stock Status if visible.

      If a URL is inaccessible, use Google Search to find information about the product based on the URL context.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.STRING },
              description: { type: Type.STRING },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              dimensions: { type: Type.STRING },
              weight: { type: Type.STRING },
              inventoryStatus: { type: Type.STRING },
              url: { type: Type.STRING }
            },
            required: ["name", "description", "url"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse extraction response", e);
      return [];
    }
  }

  /**
   * Generate SEO optimized copy based on extracted data.
   */
  async generateCopy(extractions: ProductExtraction[], category: string): Promise<GeneratedCopy> {
    const inputContext = JSON.stringify(extractions);
    const prompt = `
      Based on the following competitor product research in the category "${category}", generate a new, high-converting, SEO-optimized product listing copy for a SUPERIOR version of this product.
      
      Research Data:
      ${inputContext}

      The copy must be professional, persuasive, and include:
      1. An attention-grabbing SEO Title.
      2. A compelling Subtitle.
      3. A brief summary of the value proposition.
      4. A detailed product description.
      5. A list of optimized keywords.
      6. Clear target audience definition.
      7. Top unique selling points.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            seoTitle: { type: Type.STRING },
            seoSubtitle: { type: Type.STRING },
            briefDescription: { type: Type.STRING },
            detailedDescription: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            targetAudience: { type: Type.STRING },
            sellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["seoTitle", "briefDescription", "detailedDescription"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse copy generation", e);
      throw new Error("Copy generation failed");
    }
  }

  /**
   * Generate a product image based on the generated copy.
   */
  async generateProductImage(copy: GeneratedCopy): Promise<string> {
    const prompt = `
      Professional product photography of: ${copy.seoTitle}. 
      Context: ${copy.briefDescription}. 
      Style: Clean, minimalist studio lighting, high resolution, 4k, suitable for e-commerce, white background or elegant lifestyle setting.
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imagePart?.inlineData) {
      return `data:image/png;base64,${imagePart.inlineData.data}`;
    }
    
    throw new Error("No image generated");
  }
}
