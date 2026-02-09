# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Apple IAP Mock Server — a Node.js/Express server that handles Apple In-App Purchase receipt verification. It verifies receipts against Apple's App Store API, persists transaction data in Firebase Realtime Database, and logs debug data to Google Cloud Storage. Deployed on Heroku.

## Commands

- **Dev server:** `pnpm run start:local` (uses nodemon + dotenv)
- **Production start:** `pnpm run start` (uses dotenv)
- **Install deps:** `pnpm install`
- **Node version:** 24.x (see `.nvmrc`)

No test framework, linter, or build step is configured.

## Environment Setup

Copy `.env.example` to `.env` and fill in:
- Apple shared passwords (`APPLE_SHARED_PASSWORD_PARENT`, `APPLE_SHARED_PASSWORD_STUDENT`)
- Firebase config (7 variables: apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId)
- `GOOGLE_CLOUD_STORAGE_PRIVATE_KEY` — JSON string with service account credentials
- `GENIEBOOK_WEBHOOK_URL` — external webhook endpoint

## Architecture

**Layered structure:**

```
Routes (app.js) → Functions (function/) → Services (service/) → Models (model/)
```

- **app.js** — Express app setup and all route handlers. Routes are defined inline, not in separate router files.
- **api/apple/** — Apple receipt verification. Sends concurrent requests to both production and sandbox Apple endpoints with both parent and student shared passwords (4 parallel calls).
- **function/** — Business logic orchestration. `transaction.js` handles transaction creation/update with diff-based audit trails. `server2server.js` handles S2S webhook logging.
- **service/database/** — Firebase Realtime Database read/write operations for transactions, transaction mappers, and debug logs.
- **service/storage/** — Google Cloud Storage operations for S2S debug logging.
- **model/database/** — Data structure constructors for transaction, transaction-mapper, and user objects.
- **config.js** — Centralized env var loading.
- **firebase.js** — Firebase app + anonymous auth + GCS bucket initialization.

**Key API endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/verify` | Verify Apple IAP receipt, save/update transaction |
| POST | `/status-pooling` | Re-verify all stored transactions against Apple |
| POST | `/s2s-gb` | S2S webhook proxy to GenieBoot, logs response |
| POST | `/s2s` | S2S transaction logging |
| POST | `/s2s-no-action` | S2S no-op acknowledge |

**Firebase database paths:**
- `/transactions/{student_id}/{subject_id}` — transaction records
- `/transaction_student_mapper/{original_transaction_id}` — maps original_transaction_id → student_id
- `/debug/transactions/{student_id}/{subject_id}/{timestamp}` — audit trail with diffs

**Transaction flow:** Original transactions require `student_id` and create new records. Renewal transactions are matched via `original_transaction_id` and only update if the new `purchase_date_ms` is more recent. Bundle IDs are validated against a whitelist in `app.js`.

**Product ID format:** `{prefix}.{subjectId}.{subscriptionPlanId}` — parsed in `function/transaction.js` to extract subject and plan identifiers.
