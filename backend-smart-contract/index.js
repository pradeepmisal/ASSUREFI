const { z } = require('zod');
const { Agent } = require('@openserv-labs/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Create the agent with your OpenAI API key (required for process())
const agent = new Agent({
  systemPrompt: 'You are an agent that analyzes Ethereum smart contracts for security vulnerabilities',
  apiKey: "19e9744583aa48a7b02aaba24dda618f"
});

// API Keys from environment variables
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || 'C1H29S3J1BQA3M4UMU647APSMN961ACCMY';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA6M-6Ad8ZSIfDN0X5uuTMhNCz6Nr86P3U';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Validates if a string is a valid Ethereum address.
 * @param {string} address - The address to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
function isValidEthereumAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Fetches an Ethereum contract's source code from Etherscan.
 * @param {string} contractAddress - Ethereum contract address.
 * @returns {Promise<Object>} - Contract source code and metadata.
 */
async function getEthereumContractSource(contractAddress) {
  try {
    const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== "1") {
      throw new Error(`Etherscan API error: ${data.message || 'Unknown error'}`);
    }
    
    const contractData = data.result[0];
    
    if (!contractData.SourceCode || contractData.SourceCode.trim().length === 0) {
      throw new Error("No verified source code available for this contract");
    }
    
    return {
      address: contractAddress,
      name: contractData.ContractName,
      sourceCode: contractData.SourceCode,
      compiler: contractData.CompilerVersion
    };
  } catch (error) {
    throw new Error(`Failed to retrieve contract source: ${error.message}`);
  }
}

/**
 * Uses Gemini to generate an analysis based on a prompt.
 * @param {string} prompt - The analysis prompt.
 * @param {string} modelName - (Optional) Gemini model to use.
 * @returns {Promise<string>} - The generated text response.
 */
async function geminiAnalyze(prompt, modelName = "gemini-1.5-flash") {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw error;
  }
}

/**
 * Analyzes a smart contract using Gemini API.
 * @param {Object} contractData - Contract data with source code.
 * @returns {Promise<Object>} - Security analysis.
 */
async function analyzeContractWithGemini(contractData) {
  try {
    let codeForAnalysis = contractData.sourceCode;
    if (codeForAnalysis.length > 30000) {
      codeForAnalysis = codeForAnalysis.substring(0, 30000) + "... [truncated for length]";
    }
    
    // Escape the source code to safely include it in the prompt
    const escapedCode = JSON.stringify(codeForAnalysis);
    
    const prompt = `
      Analyze this Ethereum smart contract and identify potential security vulnerabilities.
      Contract name: ${contractData.name}
      
      Return your analysis in JSON format with the following structure:
      {
        "vulnerabilities": [
          {
            "id": number,
            "name": string,
            "description": string,
            "severity": string,
            "lineNumber": number,
            "code": string,
            "recommendation": string
          }
        ],
        "overallScore": number,
        "summary": string
      }
      
      Contract address: ${contractData.address}
      Contract source code: ${escapedCode}
    `;
    
    let responseText = await geminiAnalyze(prompt);
    responseText = responseText.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    
    const jsonMatch = responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("No JSON object found in Gemini response");
    }
    const jsonStr = jsonMatch[0];
    
    try {
      const analysisResult = JSON.parse(jsonStr);
      return analysisResult;
    } catch (parseError) {
      throw new Error(`Failed to parse Gemini JSON: ${parseError.message}`);
    }
  } catch (error) {
    throw new Error(`Error analyzing with Gemini: ${error.message}`);
  }
}

// Add capability to analyze contract by address
agent.addCapability({
  name: 'analyzeContractByAddress',
  description: 'Analyzes an Ethereum smart contract by its address',
  schema: z.object({
    contractAddress: z.string().refine(isValidEthereumAddress, {
      message: "Invalid Ethereum address format"
    })
  }),
  async run({ args }) {
    try {
      const contractData = await getEthereumContractSource(args.contractAddress);
      const analysis = await analyzeContractWithGemini(contractData);
      return JSON.stringify(analysis, null, 2);
    } catch (error) {
      return `Error analyzing contract: ${error.message}`;
    }
  }
});

// Add capability to analyze contract by source code
agent.addCapability({
  name: 'analyzeContractByCode',
  description: 'Analyzes an Ethereum smart contract by its source code',
  schema: z.object({
    code: z.string().min(1, "Contract source code cannot be empty")
  }),
  async run({ args }) {
    try {
      const contractData = {
        address: "Not provided",
        name: "Direct Analysis",
        sourceCode: args.code,
        compiler: "Not provided"
      };
      
      const analysis = await analyzeContractWithGemini(contractData);
      return JSON.stringify(analysis, null, 2);
    } catch (error) {
      return `Error analyzing contract: ${error.message}`;
    }
  }
});

// Start the agent's HTTP server
agent.start();

// Now that you have a valid API key, you can call process() to trigger the conversation.
// async function main() {
//   try {
//     const result = await agent.process({
//       messages: [
//         {
//           role: 'user',
//           content: 'Analyze the smart contract at address 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
//         }
//       ]
//     });
//     console.log('Analysis result:', result.choices[0].message.content);
//   } catch (error) {
//     console.error('Error in agent process:', error);
//   }
// }

// main().catch(console.error);
