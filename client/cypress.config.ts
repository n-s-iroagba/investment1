const urls = {
  dev: 'http://localhost:3001',
  staging: 'https://staging.example.com',
  prod: 'https://example.com',
} as const;

// Derive a type of allowed keys: "dev" | "staging" | "prod"
type Env = keyof typeof urls;

// Suppose you get `env` from process.env.NODE_ENV (string | undefined)
const rawEnv = process.env.NODE_ENV;  

// Cast or validate it into your `Env` type:
const env = (rawEnv ?? 'dev') as Env;  

import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    // Now TS knows `env` is one of the keys of `urls`
    baseUrl: urls[env],
  },
});
