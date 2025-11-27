import { GoogleGenAI } from "@google/genai";
import { AppMode } from "../types";
import { MOCK_AI_RESPONSE } from "../constants";

export const getStockAnalysis = async (
  symbol: string, 
  price: number, 
  mode: AppMode
): Promise<string> => {
  // --- 模擬模式 ---
  if (mode === AppMode.MOCK) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(MOCK_AI_RESPONSE.replace('AAPL', symbol));
      }, 1500);
    });
  }

  // --- 真實模式 ---
  // 檢查 API Key 是否存在
  if (!process.env.API_KEY) {
    return "錯誤：偵測到真實模式，但未設定 Gemini API Key (process.env.API_KEY)。請檢查環境變數。";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // 使用 System Instruction 規範輸出格式 (禁止 Markdown)
    const systemInstruction = "你是一位專業的金融分析師。請針對使用者提供的股票代號與現價進行簡短分析。請直接輸出純文字，不要使用 Markdown 語法（例如不要用 **bold** 或 # 標題），請用縮排或符號列表呈現清晰的排版。";
    
    const prompt = `請分析股票代號 ${symbol}，目前價格為 ${price}。請給出：1. 公司簡介與近期表現。2. 技術面簡單分析。3. 給予投資人的具體操作建議。字數控制在 300 字以內。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "無法取得分析結果。";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `AI 分析發生錯誤: ${(error as Error).message}`;
  }
};