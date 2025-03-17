// Make sure you have Node.js v18+ which supports fetch natively or install node-fetch if needed
// Replace with your actual Etherscan API key and desired contract address.
const apiKey = 'C1H29S3J1BQA3M4UMU647APSMN961ACCMY';
const contractAddress = '0x36A500F731e2FFA29207499EFb29326b671000AC';

// Construct the Etherscan API URL.
const url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${apiKey}`;

async function getContractSource() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.status === "1") {
      const contractSource = data.result[0].SourceCode;
      if (contractSource && contractSource.trim().length > 0) {
        console.log("Contract Source Code:\n", contractSource);
      } else {
        console.log("No verified source code available for this contract.");
      }
    } else {
      console.error("Etherscan API error:", data.message);
    }
  } catch (error) {
    console.error("Error retrieving source code:", error);
  }
}

getContractSource();
