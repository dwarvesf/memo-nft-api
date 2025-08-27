import { createConfig } from "ponder";
import { http } from "viem";
import { dwarvesMemoABI } from "./abis/dwarvesMemoABI";

export default createConfig({
  database: process.env.PONDER_DATABASE_URL
    ? {
        kind: "postgres",
        connectionString: process.env.PONDER_DATABASE_URL,
        poolConfig: {
          max: 5,
          connectionTimeoutMillis: 10000,
          idleTimeoutMillis: 30000,
        },
      }
    : undefined, // Use default PGLite when no DATABASE_URL
  networks: {
    base: {
      chainId: 8453,
      transport: http(process.env.PONDER_RPC_URL_8453),
    },
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_URL_84532),
    },
  },
  contracts: {
    DwarvesMemo: {
      network: process.env.APP_ENV === "PROD" ? "base" : "baseSepolia",
      address: (process.env.MEMO_NFT_ADDRESS as "0x") || "0x",
      startBlock: Number(process.env.START_BLOCK || 0),
      abi: dwarvesMemoABI,
    },
  },
});
