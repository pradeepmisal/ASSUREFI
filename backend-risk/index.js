const { z } = require('zod');
const { Agent } = require('@openserv-labs/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create the agent with a system prompt and API key.
const agent = new Agent({
  systemPrompt: 'You are an agent that performs blockchain token risk analysis by combining on-chain data, contract insights, and market sentiment.',
  apiKey: process.env.AGENT_API_KEY || "19e9744583aa48a7b02aaba24dda618f"
});

// Helper function to fetch JSON and log error responses.
async function fetchWithError(url, options, errorMsg) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${errorMsg} Status: ${res.status}. Response: ${text}`);
  }
  return res.json();
}

// Add the riskAnalysis capability with input validation via zod.
agent.addCapability({
  name: 'riskAnalysis',
  description: 'Analyzes a blockchain token for risk based on token data, contract analysis, and sentiment analysis.',
  schema: z.object({
    token_name: z.string(),
    token_address: z.string(),
    smart_contract_address: z.string()
  }),
  async run({ args }) {
    const { token_name, token_address, smart_contract_address } = args;
    // Override chainId to "solana"
    const chainId = "solana";

    // Call the contract analysis API.
    const contractAnalysisData = await fetchWithError(
      "https://assure-fi.onrender.com/analyze-contract",
      {
        method: "GET",
        headers: { "contract-address": smart_contract_address },
      },
      'Contract analysis failed.'
    );

    // Call the token data API.
    const tokenData = await fetchWithError(
      `https://liquidity-monitoring-1.onrender.com/get_token?token_address=${token_address}&chain_id=${chainId}`,
      {
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      },
      'Token data retrieval failed.'
    );

    // Call the sentiment analysis API using token_name as the coin.
    const sentimentData = await fetchWithError(
      "https://sentiment-agent-1.onrender.com/analyze",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Coin-Name": token_name
        },
        body: JSON.stringify({ coin: token_name })
      },
      'Sentiment analysis failed.'
    );

    // Initialize Gemini API with the provided API key.
    const genAI = new GoogleGenerativeAI("AIzaSyA6M-6Ad8ZSIfDN0X5uuTMhNCz6Nr86P3U");
    // Build the prompt for Gemini based on the token and contract data.
    const prompt = `
      Analyze this blockchain token "${token_name}" based on the following data:
      
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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = await response.text();

    // Extract JSON from the Gemini response.
    const jsonMatch = textResponse.match(/({[\s\S]*})/);
    const jsonString = jsonMatch ? jsonMatch[0] : textResponse;
    const geminiAnalysis = JSON.parse(jsonString);

    // Combine all fetched and analyzed data into a final response.
    return {
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
  }
});

// Start the agent's HTTP server to process incoming requests.
agent.start();