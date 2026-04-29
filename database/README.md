# Database — Amazon DynamoDB

**Owner: PBC**

This folder contains the DynamoDB table schema, sample data, and GSI configuration for the URL Shortener.

## Table: URLMappings

| Attribute | Type | Role |
|---|---|---|
| `shortCode` | String | PRIMARY KEY (Partition Key) |
| `longURL` | String | Original URL entered by user |
| `createdAt` | String | ISO timestamp of creation |
| `expiryAt` | Number | Unix timestamp for TTL auto-delete |
| `clickCount` | Number | Total redirects (atomic counter) |
| `customCode` | Boolean | True if user provided custom code |
| `ipAddress` | String | Creator IP (rate limiting) |

## Setup Steps (AWS Console)

### Step 1 — Create the Table
1. AWS Console → DynamoDB → **Create table**
2. Table name: `URLMappings` *(exact, case-sensitive)*
3. Partition key: `shortCode` | Type: **String**
4. Leave Sort key **blank**
5. Table settings: **Customize settings**
6. Read/Write capacity: **On-demand**
7. Click **Create table** → wait for status: *Active*

### Step 2 — Enable TTL
1. Open `URLMappings` table → **Additional settings** tab
2. Time to Live (TTL) → click **Enable**
3. TTL attribute name: `expiryAt` *(must match exactly)*
4. **Save changes**

### Step 3 — Create GSI
1. `URLMappings` table → **Indexes** tab → **Create index**
2. Partition key: `createdAt` | Type: **String**
3. Index name: `createdAt-index`
4. Projected attributes: **All**
5. Click **Create index** → wait ~2 minutes for status: *Active*

### Step 4 — Verify
1. Go to **Explore items** → click **Run**
2. Should show an empty table (no items yet)
3. Take a screenshot — required for documentation

## Files in This Folder
- `schema.json` — Full table definition with all attributes
- `sample_items.json` — Sample DynamoDB records for testing
- `gsi_config.json` — GSI configuration and design notes