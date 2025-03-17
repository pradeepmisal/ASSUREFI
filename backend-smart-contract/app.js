import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

// Global middleware for JSON parsing (used by GET route and POST route expecting JSON)
app.use(express.json());

// API Keys
const ETHERSCAN_API_KEY = 'C1H29S3J1BQA3M4UMU647APSMN961ACCMY';
const GEMINI_API_KEY = 'AIzaSyA6M-6Ad8ZSIfDN0X5uuTMhNCz6Nr86P3U';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Validates if a string is a valid Ethereum address
 * @param {string} address - The address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidEthereumAddress(address) {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Fetches an Ethereum contract's source code from Etherscan
 * @param {string} contractAddress - Ethereum contract address
 * @returns {Promise<Object>} - Contract source code and metadata
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
 * Uses Gemini to generate an analysis based on a prompt
 * @param {string} prompt - The analysis prompt
 * @param {string} modelName - (Optional) Gemini model to use
 * @returns {Promise<string>} - The generated text response
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
 * Analyzes a smart contract using Gemini API
 * @param {Object} contractData - Contract data with source code
 * @returns {Promise<Object>} - Security analysis
 */
async function analyzeContractWithGemini(contractData) {
    try {
      let codeForAnalysis = contractData.sourceCode;
      if (codeForAnalysis.length > 30000) {
        codeForAnalysis = codeForAnalysis.substring(0, 30000) + "... [truncated for length]";
      }
      
      // Use JSON.stringify() to escape the source code so that any special characters are handled.
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
  

// GET route for smart contract analysis using header input (unchanged)
app.get('/analyze-contract', async (req, res) => {
  try {
    const contractAddress = req.headers['contract-address'];
    
    if (!contractAddress) {
      return res.status(400).json({ error: "Missing contract-address in request header" });
    }
    
    if (!isValidEthereumAddress(contractAddress)) {
      return res.status(400).json({ error: "Invalid Ethereum address format" });
    }
    
    const contractData = await getEthereumContractSource(contractAddress);
    const analysis = await analyzeContractWithGemini(contractData);
    return res.json(analysis);
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze smart contract" });
  }
});

// POST route for direct code analysis using JSON input (expects { code: "..." })
app.post('/analyze-contract', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Missing contract source code in request body" });
    }
    
    // Build contract data using provided code
    const contractData = {
      address: "Not provided",
      name: "Direct Analysis",
      sourceCode: code,
      compiler: "Not provided"
    };
    
    const analysis = await analyzeContractWithGemini(contractData);
    return res.json(analysis);
  } catch (error) {
    console.error("Request error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze smart contract" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Ethereum smart contract analyzer service running on port ${port}`);
});
