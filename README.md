# Ajaia Docs

A lightweight collaborative document editor. Create, edit, and share documents with rich text formatting.

## Live URL
https://ajaia-llc-ai-native-full-stack-deve.vercel.app/

## Test Accounts (pre-seeded)
Switch users using the dropdown in the top-right corner.

| Name          | User ID     |
|---------------|-------------|
| Alice Johnson | user_alice  |
| Bob Smith     | user_bob    |
| Carol White   | user_carol  |

## Local Setup

### Prerequisites
- Node.js 18+
- npm

### Steps
git clone <repo-url>
cd ajaia-docs
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

Open http://localhost:3000

## Running Tests
Run the dev server first, then in a second terminal:
npm test

## Supported File Upload Formats
.txt and .md only (max 5MB). Files are imported as new editable documents.
