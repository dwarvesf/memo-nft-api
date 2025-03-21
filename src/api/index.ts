import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { count, eq, graphql, replaceBigInts } from "ponder";

const app = new Hono();

app.use("/graphql", graphql({ db, schema }));

app.get("/count/:tokenId", async (c) => {
  const tokenId = c.req.param("tokenId");

  const [result] = await db
    .select({ count: count() })
    .from(schema.memoMintedEvent)
    .where(eq(schema.memoMintedEvent.tokenId, BigInt(tokenId)));

  return c.json({
    count: result?.count ?? 0,
  });
});

app.get("/minters/:tokenId", async (c) => {
  const tokenId = c.req.param("tokenId");
  const limit = c.req.query("limit") ?? 10;
  const offset = c.req.query("offset") ?? 0;

  const result = await db
    .select({
      minter: schema.memoMintedEvent.to,
      amount: schema.memoMintedEvent.amount,
    })
    .from(schema.memoMintedEvent)
    .where(eq(schema.memoMintedEvent.tokenId, BigInt(tokenId)))
    .limit(Number(limit))
    .offset(Number(offset));

  const [countResult] = await db
    .select({ count: count() })
    .from(schema.memoMintedEvent)
    .where(eq(schema.memoMintedEvent.tokenId, BigInt(tokenId)));

  return c.json({
    data: replaceBigInts(result, (b) => b.toString()),
    total: countResult?.count ?? 0,
  });
});

export default app;
