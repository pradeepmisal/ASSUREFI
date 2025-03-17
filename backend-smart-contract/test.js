import { InfuraProvider } from "ethers";

// Replace with your own Infura API key.
const INFURA_API_KEY = "c63bfe2857d14689b7d061d27c85dc78";

// Connect to the Ethereum mainnet via Infura.
const provider = new InfuraProvider("mainnet", INFURA_API_KEY);

// Function to fetch the smart contract bytecode
async function getSmartContractCode(contractAddress) {
  try {
    const bytecode = await provider.getCode(contractAddress);
    if (bytecode === "0x") {
      console.log("No contract deployed at this address.");
    } else {
      console.log("Smart Contract Bytecode:", bytecode);
    }
  } catch (error) {
    console.error("Error fetching contract code:", error);
  }
}

// Replace with the smart contract address you want to query.
const contractAddress = "0x42f0d280e1f4fb064650653445a3c904e61f64b1";

getSmartContractCode(contractAddress);
