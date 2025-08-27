# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Memo NFT API built with Ponder - a TypeScript framework for building robust, performant blockchain indexers. The project indexes NFT mint events from the DwarvesMemo smart contract on Base/Base Sepolia networks and provides both GraphQL and REST APIs for querying the data.

## Development Commands

### Core Development
- `pnpm dev` - Run indexer and API in development mode with hot reload
- `pnpm start` - Start production build
- `pnpm db` - Database management commands
- `pnpm codegen` - Generate TypeScript types from schema
- `pnpm serve` - Serve API only (without indexing)

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler checks

### Make Commands (Recommended)
- `make help` - Show all available commands
- `make dev` - Start development mode (initializes DB + runs indexer/API)
- `make start` - Start production mode
- `make serve` - Serve API only (without indexing)
- `make install` - Install dependencies
- `make clean` - Clean and reinstall dependencies
- `make test` - Run all code quality checks (lint + typecheck)
- `make health` - Check application health endpoint
- `make logs` - Show database logs

### Docker Environment  
- `make db-init` - Initialize Docker PostgreSQL database
- `make db-down` - Stop database services
- `make db-clean` - Stop and remove database volumes (clean reset)

## Architecture

### Ponder Framework Structure
- **ponder.config.ts**: Main configuration for networks, contracts, and database connection
- **ponder.schema.ts**: Database schema definitions using onchainTable
- **src/index.ts**: Event handlers for blockchain events (main indexing logic)
- **src/api/index.ts**: Hono-based REST API endpoints and GraphQL server
- **abis/**: Smart contract ABIs for type-safe contract interactions

### Key Components
- **Database**: PostgreSQL (configured via `PONDER_DATABASE_URL`)
- **Networks**: Base (prod) and Base Sepolia (dev) via RPC endpoints
- **API Framework**: Hono for REST endpoints
- **GraphQL**: Auto-generated from Ponder schema
- **External Integrations**: 
  - Arweave for NFT metadata storage
  - Mochi Profile API for user data
  - Discord webhook notifications via MCP client

### Event Processing Flow
1. Listens for `TokenMinted` events from DwarvesMemo contract
2. Stores event data in `memo_minted_events` table
3. Fetches NFT metadata from Arweave via contract's `readNFT` function
4. Enriches collector info using Mochi Profile API
5. Sends Discord notification via MCP Discord webhook client (optional, non-blocking)

## Environment Configuration

Required environment variables (create `.env.local` based on `.env.local.example`):
- `PONDER_DATABASE_URL`: PostgreSQL connection string
- `PONDER_RPC_URL_8453`: Base mainnet RPC URL
- `PONDER_RPC_URL_84532`: Base Sepolia testnet RPC URL
- `APP_ENV`: "PROD" for Base mainnet, otherwise Base Sepolia
- `MEMO_NFT_ADDRESS`: DwarvesMemo contract address
- `START_BLOCK`: Block number to start indexing from

Optional Discord notification variables:
- `ENABLE_DISCORD_NOTIFICATIONS`: Set to "false" to disable Discord notifications (default: enabled)
- `DISCORD_WEBHOOK_URL`: Discord webhook URL for notifications
- `OPENAI_API_KEY`: Required for MCP Discord client
- `MCP_CONNECTION_TIMEOUT`: MCP connection timeout in ms (default: 10000)
- `MCP_RETRY_ATTEMPTS`: Number of retry attempts for MCP connection (default: 3)

## Database Schema

Uses environment-specific schema naming:
- Development: `memo_nft_dev`
- Production: `memo_nft_PROD`

Single table `memo_minted_events` with:
- `id`: Primary key (event ID)
- `to`: Minter address (hex)
- `tokenId`: NFT token ID (bigint, indexed)
- `amount`: Mint amount (bigint)
- `timestamp`: Block timestamp (integer)

## API Endpoints

- **GraphQL**: `/graphql` - Auto-generated from schema
- **REST**:
  - `GET /count/:tokenId` - Get mint count for token
  - `GET /minters/:tokenId` - Get minters with pagination (limit, offset)
  - `GET /healthz` - Health check

## Development Notes

- Uses Viem for type-safe Ethereum interactions
- BigInt handling via `replaceBigInts` utility for JSON serialization
- MCP (Model Context Protocol) integration for Discord notifications with resilient connection handling
- Discord notifications are optional and non-blocking - server starts even if MCP connection fails
- Network switching based on `APP_ENV` (Base vs Base Sepolia)
- TypeScript strict mode with Ponder's generated types

## Discord Notifications Architecture

The Discord notification system is designed to be resilient and optional:
- **Lazy Initialization**: MCP connection established on first notification attempt
- **Circuit Breaker**: Exponential backoff with configurable retry limits
- **Graceful Degradation**: Core indexing continues even when Discord is unavailable
- **Connection Timeout**: Configurable timeout prevents hanging on connection attempts
- **Error Handling**: All MCP operations wrapped with comprehensive error handling

## Production Deployment Notes

- **Schema Naming**: Uses environment-specific schemas (`memo_nft_${APP_ENV}`) to prevent conflicts
- **Database Migration**: Schema conflicts resolved by using unique names per environment
- **Service Independence**: Discord notifications are completely optional and won't block startup