import { createConfig } from "ponder";
import { http } from "viem";
import { dwarvesMemoABI } from "./abis/dwarvesMemoABI";

export default createConfig({
  networks: {
    mainnet: {
      chainId: 1,
      transport: http(process.env.PONDER_RPC_URL_1),
    },
    baseSepolia: {
      chainId: 84532,
      transport: http(process.env.PONDER_RPC_URL_84532),
    },
  },
  contracts: {
    DwarvesMemo: {
      network: "baseSepolia",
      abi: dwarvesMemoABI,
      address: "0xb1e052156676750d193d800d7d91ea0c7ceeadf0",
      startBlock: 23233931,
    },
  },
});
