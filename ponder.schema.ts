import { index, onchainTable } from "ponder";

export const memoMintedEvent = onchainTable(
  "memo_minted_events",
  (p) => ({
    id: p.text().primaryKey(),
    to: p.hex().notNull(),
    amount: p.bigint().notNull(),
    tokenId: p.bigint().notNull(),
    timestamp: p.integer().notNull(),
  }),
  (table) => ({
    tokenIdIdx: index("token_id").on(table.tokenId),
  })
);
