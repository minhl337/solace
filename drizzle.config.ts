import * as dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

const config = {
  dialect: "postgresql",
  schema: "./src/db/schema.ts", // Path to your Drizzle schema file
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
}

export default config
