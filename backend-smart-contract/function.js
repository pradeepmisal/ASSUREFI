import { ethers } from 'ethers';
import axios from 'axios';

// Predefined mapping of token names to contract addresses
const TOKEN_ADDRESS_MAP = {
  "uniswap": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "uni": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  "chainlink": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "link": "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  "aave": "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  "compound": "0xc00e94Cb662C3520282E6f5717214004A7f26888",
  "dai": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  "tether": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "usdt": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  "usdc": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "shiba": "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  "maker": "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
  "polygon": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  "matic": "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  "sushiswap": "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  "sushi": "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
  "pancake": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  "cake": "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
};

/**
 * Smart Contract Security Analyzer
 * Finds a smart contract by token name, extracts contract code and metadata,
 * sends it to Gemini for security analysis, and returns structured vulnerability data
 */
export async function analyzeSmartContractSecurity(tokenName) {
  try {
    // Step 1: Find smart contract address from token name using our predefined map
    const contractAddress = findContractAddressByTokenName(tokenName);
    if (!contractAddress) {
      throw new Error(`Could not find contract address for token: ${tokenName}`);
    }
    
    console.log(`Found contract address for ${tokenName}: ${contractAddress}`);
    
    // Step 2: Access smart contract code and ABI
    const contractData = await getSmartContractData(contractAddress);
    if (!contractData) {
      throw new Error(`Could not fetch contract data for address: ${contractAddress}`);
    }
    
    // Step 3: Generate and send prompt to Gemini
    const securityAnalysis = await analyzeContractWithGemini(contractData);
    
    // Step 4: Parse response and format as JSON array
    return parseSecurityResponse(securityAnalysis);
    
  } catch (error) {
    console.error(`Error analyzing smart contract: ${error.message}`);
    throw error;
  }
}

/**
 * Find the contract address using token name from our predefined map
 */
function findContractAddressByTokenName(tokenName) {
  // Normalize the token name (lowercase)
  const normalizedTokenName = tokenName.toLowerCase();
  
  // Check if token is in our map
  const contractAddress = TOKEN_ADDRESS_MAP[normalizedTokenName];
  
  if (contractAddress) {
    console.log(`Found address for ${tokenName} in predefined map: ${contractAddress}`);
  } else {
    console.log(`Token ${tokenName} not found in predefined map`);
  }
  
  return contractAddress;
}

/**
 * Get smart contract source code and ABI
 * Uses Etherscan API to fetch verified contract code
 */
async function getSmartContractData(contractAddress) {
  try {
    // This example uses Etherscan API to get verified contract source code
    const ETHERSCAN_API_KEY = "C1H29S3J1BQA3M4UMU647APSMN961ACCMY";
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'contract',
        action: 'getsourcecode',
        address: contractAddress,
        apikey: ETHERSCAN_API_KEY
      }
    });
    
    if (response.data.status !== '1' || !response.data.result[0].SourceCode) {
      throw new Error('Contract source code not found or not verified');
    }
    
    return {
      address: contractAddress,
      name: response.data.result[0].ContractName,
      sourceCode: response.data.result[0].SourceCode,
      abi: response.data.result[0].ABI
    };
    
  } catch (error) {
    console.error(`Error fetching contract data: ${error.message}`);
    return null;
  }
}

/**
 * Send smart contract data to Gemini for security analysis
 */
async function analyzeContractWithGemini(contractData) {
  try {
    const GEMINI_API_KEY = "AIzaSyC7o4-B2AQAZHS8DzmuqMWmW3qAqJNqN88";
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    // Create detailed prompt for Gemini to analyze contract security
    const prompt = `
    Analyze the following smart contract for security vulnerabilities and provide a risk assessment.
    
    Contract Name: ${contractData.name}
    Contract Address: ${contractData.address}
    
    Source Code:
    \`\`\`solidity
    ${contractData.sourceCode}
    \`\`\`
    
    Return your analysis as a JSON array of vulnerability objects with the following structure:
    [
      {
        "id": number,
        "name": string,
        "description": string,
        "severity": "critical" | "high" | "medium" | "low" | "informational",
        "lineNumber": number,
        "code": string (the vulnerable code snippet),
        "recommendation": string
      }
    ]
    
    Also include an overall risk score from 0-100, where 100 is extremely risky.
    `;
    
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192
        }
      }
    );
    
    return response.data.candidates[0].content.parts[0].text;
    
  } catch (error) {
    console.error(`Error analyzing with Gemini: ${error.message}`);
    throw error;
  }
}

/**
 * Parse and format Gemini's response into structured data
 */
function parseSecurityResponse(geminiResponse) {
  try {
    // Extract JSON from response
    const jsonMatch = geminiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON data from Gemini response');
    }
    
    const vulnerabilities = JSON.parse(jsonMatch[0]);
    
    // Extract risk score if present
    let riskScore = 0;
    const riskScoreMatch = geminiResponse.match(/risk score.*?(\d+)/i);
    if (riskScoreMatch) {
      riskScore = parseInt(riskScoreMatch[1]);
    }
    
    return {
      riskScore: riskScore,
      vulnerabilities: vulnerabilities
    };
    
  } catch (error) {
    console.error(`Error parsing Gemini response: ${error.message}`);
    throw error;
  }
}

// Direct address analyzer function
export async function analyzeSmartContractByAddress(contractAddress) {
  try {
    console.log(`Analyzing contract at address: ${contractAddress}`);
    
    // Access smart contract code and ABI
    const contractData = await getSmartContractData(contractAddress);
    if (!contractData) {
      throw new Error(`Could not fetch contract data for address: ${contractAddress}`);
    }
    
    // Generate and send prompt to Gemini
    const securityAnalysis = await analyzeContractWithGemini(contractData);
    
    // Parse response and format as JSON array
    return parseSecurityResponse(securityAnalysis);
    
  } catch (error) {
    console.error(`Error analyzing smart contract: ${error.message}`);
    throw error;
  }
}