import { createPublicClient, http, encodePacked, keccak256, namehash } from "viem";
import { base } from "viem/chains";

// Replace YOUR_ALCHEMY_KEY with your key from https://alchemy.com (free tier works)
// Create app → select Base → Mainnet → copy API key
const ALCHEMY_KEY = "Ie7GoXhAtMJzLf7cKyxfM";

const baseClient = createPublicClient({
  chain: base,
  transport: http(
    ALCHEMY_KEY !== "YOUR_ALCHEMY_KEY"
      ? `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
      : "https://base.llamarpc.com" // higher rate limits than mainnet.base.org
  ),
});

const BASENAME_L2_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

const ABI = [
  {
    inputs: [{ internalType: "bytes32", name: "node", type: "bytes32" }],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
];

function convertReverseNodeToBytes(address) {
  const addressFormatted = address.toLowerCase().replace("0x", "");
  const addressNode = keccak256(encodePacked(["string"], [addressFormatted]));
  const baseReverseNode = namehash("8453.reverse");
  return keccak256(encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode]));
}

const cache = new Map();

export async function resolveName(address) {
  if (!address) return "";
  if (cache.has(address)) return cache.get(address);

  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;

  try {
    const node = convertReverseNodeToBytes(address);
    const name = await baseClient.readContract({
      address: BASENAME_L2_RESOLVER,
      abi: ABI,
      functionName: "name",
      args: [node],
    });

    if (name && name.length > 0) {
      console.log(`Resolved ${address} → ${name}`);
      cache.set(address, name);
      return name;
    }
  } catch (e) {
    console.warn("Basename lookup failed:", e.message);
  }

  cache.set(address, short);
  return short;
}
