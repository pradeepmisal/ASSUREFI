import express from 'express';
import cors from 'cors';
// import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyA6M-6Ad8ZSIfDN0X5uuTMhNCz6Nr86P3U");

// Function to call Gemini API with token data
async function analyzeTokenWithGemini(tokenData, contractAnalysisData, tokenName) {
  try {
    // Create the prompt for Gemini based on the token and contract data
    const prompt = `
    Analyze this blockchain token "${tokenName}" based on the following data:
    
    Token Data: ${JSON.stringify(tokenData)}
    Contract Analysis: ${JSON.stringify(contractAnalysisData)}
    
    Please provide a comprehensive risk assessment in the following JSON format:
    {
      "riskData": [
        { "category": "Contract Risk", "risk": 0-100 },
        { "category": "Liquidity Risk", "risk": 0-100 },
        { "category": "Market Sentiment", "risk": 0-100 },
        { "category": "Developer Activity", "risk": 0-100 },
        { "category": "Community Trust", "risk": 0-100 }
      ],
      "insightsList": [
        {
          "title": "Example Insight 1",
          "description": "Detailed description of the insight",
          "icon": "IconName",
          "iconColor": "text-color-class",
          "action": "Action Label"
        }
        // 3-4 more insights based on the data
      ],
      "chartData": [
        { "name": "Month1", "Risk": 0-100, "Average": 0-100 },
        { "name": "Month2", "Risk": 0-100, "Average": 0-100 }
        // Include 6 months of data
      ],
      "riskConfig": {
        "Risk": { "label": "Project Risk", "color": "#ef4444" },
        "Average": { "label": "Industry Average", "color": "#3b82f6" }
      }
    }
    
    Ensure the risk values are realistic and based on the provided data. The insights should be specific and actionable, with appropriate icons from: FileSearch, Activity, TrendingDown, BarChart3, ShieldAlert, Users, Code, Lock.
    Icon colors should be: text-red-500 for high risk, text-amber-500 for medium risk, text-green-500 for low risk.
    `;

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = await response.text();
    
    // Parse the JSON response (in case Gemini adds extra text)
    const jsonMatch = textResponse.match(/({[\s\S]*})/);
    const jsonString = jsonMatch ? jsonMatch[0] : textResponse;
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error(`Gemini API error: ${error.message}`);
  }
}

// API endpoint to get token details and analysis
app.post('/risk-analysis', async (req, res) => {
  try {
    // Extract token details from request body
    const { token_name, token_address, smart_contract_address } = req.body;
    
    // Override chainId to "solana"
    const chainId = "solana";

    if (!token_address || !smart_contract_address) {
      return res.status(400).json({ 
        error: 'Missing required parameters. Please provide token_address and smart_contract_address.'
      });
    }

    console.log(`Analyzing token: ${token_name} (${token_address})`);
    console.log(`Smart contract: ${smart_contract_address}`);
    console.log(`Chain ID: ${chainId}`);

    // Call the contract analysis API
    const contractAnalysisResponse = await fetch("https://assure-fi.onrender.com/analyze-contract", {
      method: "GET",
      headers: {
        "contract-address": smart_contract_address,
      },
    });

    if (!contractAnalysisResponse.ok) {
      return res.status(contractAnalysisResponse.status).json({
        error: `Contract analysis failed with status: ${contractAnalysisResponse.status}`
      });
    }
    const contractAnalysisData = await contractAnalysisResponse.json();

    // Call the token data API
    const tokenDataResponse = await fetch(
      `https://liquidity-monitoring-1.onrender.com/get_token?token_address=${token_address}&chain_id=${chainId}`,
      {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!tokenDataResponse.ok) {
      return res.status(tokenDataResponse.status).json({
        error: `Token data retrieval failed with status: ${tokenDataResponse.status}`
      });
    }
    const tokenData = await tokenDataResponse.json();

    // Call the sentiment analysis API
    // Use the token_name as the coin for sentiment analysis.
    const coin = token_name;
    const sentimentUrl = "https://sentiment-agent-1.onrender.com/analyze";
    const sentimentHeaders = {
      "Content-Type": "application/json",
      "X-Coin-Name": coin  // Sending coin name in header
    };

    const sentimentResponse = await fetch(sentimentUrl, {
      method: "POST",
      headers: sentimentHeaders,
      body: JSON.stringify({ coin: coin }) // Sending coin name in body as well
    });

    if (!sentimentResponse.ok) {
      return res.status(sentimentResponse.status).json({
        error: `Sentiment analysis failed with status: ${sentimentResponse.status}`
      });
    }
    const sentimentData = await sentimentResponse.json();

    // Call Gemini API to analyze the token data
    const geminiAnalysis = await analyzeTokenWithGemini(tokenData, contractAnalysisData, token_name);

    // Combine all data into the final response
    const responseData = {
      token_info: {
        name: token_name,
        address: token_address,
        contract: smart_contract_address,
        chain_id: chainId
      },
      tokenData,
      contractAnalysis: contractAnalysisData,
      sentimentAnalysis: sentimentData,
      ...geminiAnalysis
    };

    res.json(responseData);
  } catch (error) {
    console.error('Error in token analysis:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Token risk analysis API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Token risk analysis server running on port ${PORT}`);
});

export default app;
