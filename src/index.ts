import { ponder } from "ponder:registry";
import { memoMintedEvent } from "ponder:schema";

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const mcpDiscord = new Client(
  {
    name: "Discord MCP Client",
    version: "1.0.0"
  }
);

ponder.on("DwarvesMemo:TokenMinted", async ({ event, context }) => {
  await context.db.insert(memoMintedEvent).values({
    id: event.id,
    to: event.args.to,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });

  await mcpDiscord.connect(new StdioClientTransport({
    command: "npx",
    args: [
      "@lmquang/mcp-discord-webhook@latest"
    ],
    env: {
      "PATH": process.env.PATH || "/usr/local/bin:/usr/bin:/bin",
    },
  }));

  console.log("Sending message to Discord...")
  await mcpDiscord.callTool({
    name: "discord-send-message",
    arguments: {
      username: "Memo NFT",
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      content: `${event.args.to} minted ${event.args.amount} Memo NFT `,
      embeds: [],
    }
  });
});
