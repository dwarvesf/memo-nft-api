import { ponder } from "ponder:registry";
import { memoMintedEvent } from "ponder:schema";

ponder.on("DwarvesMemo:TokenMinted", async ({ event, context }) => {
  await context.db.insert(memoMintedEvent).values({
    id: event.id,
    to: event.args.to,
    tokenId: event.args.tokenId,
    amount: event.args.amount,
    timestamp: Number(event.block.timestamp),
  });

  /* TODO: call hooks
   * api tao + delete hooks
   * loops hooks
   * call all the hooks
   */
});

ponder.on("MyAccount:transaction:from", async ({ event, context }) => {
  console.log(event);
});
