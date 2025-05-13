import { ponder } from "ponder:registry";
import { memoMintedEvent } from "ponder:schema";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createPublicClient, http } from "viem";
import { base, baseSepolia } from "viem/chains";
import { dwarvesMemoABI } from "../abis/dwarvesMemoABI";

// Create a viem public client for the appropriate network
const chainId = process.env.APP_ENV === "PROD" ? base.id : baseSepolia.id;
const chain = process.env.APP_ENV === "PROD" ? base : baseSepolia;
const publicClient = createPublicClient({
  chain,
  transport: http(
    process.env.APP_ENV === "PROD"
      ? process.env.PONDER_RPC_URL_8453
      : process.env.PONDER_RPC_URL_84532
  ),
});

const mcpDiscord = new Client({
  name: "Discord MCP Client",
  version: "1.0.0",
});

type NFTMetadata = {
  type: string;
  name: string;
  description: string;
  content: string;
  image: string; // "ar://29D_NrcYOiOLMPVROGt5v3URNxftYCDK7z1-kyNPRT0",
  authors: string[];
  author_addresses: string[];
  timestamp: number;
};

type MochiProfile = {
  id: string;
  associated_accounts: Array<{
    platform: string;
    platform_identifier: string;
    platform_metadata: {
      username?: string;
    };
  }>;
  avatar: string;
}


// Side Effects: send mint notification to Discord
await mcpDiscord.connect(
  new StdioClientTransport({
    command: "npx",
    args: ["-y", "@lmquang/mcp-discord-webhook@latest"],
    env: {
      PATH: process.env.PATH || "/usr/local/bin:/usr/bin:/bin",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    },
  })
);

ponder.on("DwarvesMemo:TokenMinted", async ({ event, context }) => {
  // Main: save event to db for later use
  await context.db.insert(memoMintedEvent).values({
    id: event.id,
    to: event.args.to,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });


  // Fetch NFT metadata uri from contract ussing the tokenId
  // sample https://arweave.developerdao.com/3W-Sb3cL1yXtJSjG_ffZjSpCnY02z9yv2KpW87E4Ofw
  const metadataURI = await publicClient.readContract({
    address: process.env.MEMO_NFT_ADDRESS as `0x${string}`,
    abi: dwarvesMemoABI,
    functionName: "readNFT",
    args: [event.args.tokenId],
  });

  // Improvement: can use zod to validate the metadata
  const nftMetadata = await fetch(metadataURI).then(
    (res) => res.json() as Promise<NFTMetadata>
  );

  // fetch user info from collector address
  let collectorUsername: string = event.args.to;
  try {
    const profileResponse = await fetch(`https://api.mochi-profile.console.so/api/v1/profiles/get-by-evm/${event.args.to as `0x${string}`}?no_fetch_amount=false`);
    if (profileResponse.ok) {
      const profileData = await profileResponse.json() as MochiProfile;

      // Find Discord account from associated accounts
      const discordAccount = profileData.associated_accounts.find(
        account => account.platform === "discord"
      );

      if (discordAccount?.platform_metadata?.username) {
        collectorUsername = discordAccount.platform_metadata.username;
      }
    }
  } catch (error) {
    console.error("Error fetching collector profile:", error);
  }

  let message = `
  Please compose a message to send to Discord with the following information:]\n
  { 
   "collector": "${collectorUsername}", // set in field
   "name": "${nftMetadata.name}", 
   "image": "${nftMetadata.image.replace("ar://", "https://arweave.net/")}",
   "authors": "${nftMetadata.authors}" // set in field
  }
  `;

  await mcpDiscord.callTool({
    name: "discord-send-embed",
    arguments: {
      username: "Memo NFT",
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      content: message,
      autoFormat: true,
      embeds: [],
    },
  });
});
