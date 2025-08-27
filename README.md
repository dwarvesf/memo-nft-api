# Memo NFT API

Indexer and API of Memo NFT contract


## How to run

### Quick Start (Recommended)
```bash
make install          # Install dependencies  
# Add .env.local with required environment variables
make dev              # Start development (DB + indexer + API)
```

### Manual Steps
1. Install deps with `pnpm i`
2. Add .env.local with required environment variables
3. Run indexer and api with `pnpm dev`

### Available Commands
Run `make help` to see all available commands including:
- `make dev` - Full development setup
- `make test` - Run code quality checks
- `make health` - Check API health
- `make logs` - View database logs

## Environment Configuration

### Required Variables
- `PONDER_DATABASE_URL`: PostgreSQL connection string
- `PONDER_RPC_URL_8453`: Base mainnet RPC URL  
- `PONDER_RPC_URL_84532`: Base Sepolia testnet RPC URL
- `APP_ENV`: "PROD" for Base mainnet, otherwise Base Sepolia
- `MEMO_NFT_ADDRESS`: DwarvesMemo contract address
- `START_BLOCK`: Block number to start indexing from

### Optional Discord Notifications
- `ENABLE_DISCORD_NOTIFICATIONS`: Set to "false" to disable (default: enabled)
- `DISCORD_WEBHOOK_URL`: Discord webhook URL for notifications
- `OPENAI_API_KEY`: Required for MCP Discord client
- `MCP_CONNECTION_TIMEOUT`: Connection timeout in ms (default: 10000)
- `MCP_RETRY_ATTEMPTS`: Number of retry attempts (default: 3)

**Note**: Discord notifications are optional. The server will start and function normally even if Discord MCP connection fails.

## How to deploy
1. Setup env follow `.env.local.example` file
2. Use `pnpm start` command to run
