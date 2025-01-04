// Discord API configuration
export const GUILD_ID = '1138670083321905212';
export const API_ENDPOINT = `https://canary.discord.com/api/v9/guilds/${GUILD_ID}/requests`;
export const AUTH_TOKEN = '';

// Message to send to applicants
export const MESSAGE = `
Ways to join the guild

- invite 2 people to the server
- pay 10$ for lifetime 
- boost

you can do whatever of those options you want 

discord.gg/louu you need to join louu if your not in it i cant accept
`;

// API request configuration
export const MAX_RETRIES = 3;
export const INITIAL_RETRY_DELAY = 1000; // in milliseconds

// Rate limiting
export const RATE_LIMIT_DELAY = 5000; // in milliseconds

// Pagination
export const REQUESTS_PER_PAGE = 100;

// Delays
export const INTER_REQUEST_DELAY = 1000; // in milliseconds
export const INTER_BATCH_DELAY = 5000; // in milliseconds
export const ERROR_RETRY_DELAY = 30000; // in milliseconds

// Headers
export const API_HEADERS = {
  "accept": "*/*",
  "accept-language": "en-US",
  "priority": "u=1, i",
  "sec-ch-ua": "\"Not;A=Brand\";v=\"24\", \"Chromium\";v=\"128\"",
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": "\"Windows\"",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "x-debug-options": "bugReporterEnabled",
  "x-discord-locale": "en-US",
  "x-discord-timezone": "America/Santiago",
  "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJjYW5hcnkiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC44OTciLCJvc192ZXJzaW9uIjoiMTAuMC4yNjEwMCIsIm9zX2FyY2giOiJ4NjQiLCJhcHBfYXJjaCI6Ing2NCIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImhhc19jbGllbnRfbW9kcyI6ZmFsc2UsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIERpc2NvcmQvMS4wLjg5NyBDaHJvbWUvMTI4LjAuNjYxMy4xODYgRWxlY3Ryb24vMzIuMi43IFNhZmFyaS81MzcuMzYiLCJicm93c2VyX3ZlcnNpb24iOiIzMi4yLjciLCJvc19zZGtfdmVyc2lvbiI6IjI2MTAwIiwiY2xpZW50X2J1aWxkX251bWJlciI6MzU2NTQwLCJuYXRpdmVfYnVpbGRfbnVtYmVyIjo1NzA0MCwiY2xpZW50X2V2ZW50X3NvdXJjZSI6bnVsbH0=",
  "Referer": `https://canary.discord.com/channels/@me/${GUILD_ID}`,
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

export const COOKIE = "__dcfduid=1eb586c0be0d11efa898d5e651b2a473; __sdcfduid=1eb586c1be0d11efa898d5e651b2a4733cbc59cd6d795e9a50449944462ac7eb322ac849cec5192b3fc7e3fd438d00ee; dbind=7de9e46e-58ea-4ad8-afb1-ba32dd3e0bac; __stripe_mid=26a00557-3574-4b86-99ae-752c6da0216179fe46; _cfuvid=Aa83GWMtqqeE4SgJIfMRzUxF.dnSg9..YyiXtgbqD4c-1735957847815-0.0.1.1-604800000; __cfruid=61dcc461287c2777f1c6487d91dd327e6ac4ae76-1735958053; cf_clearance=d6fQ_MpvxMeuEBHdEHgYjyI1rva51tEY9Q5xmexR0LQ-1735966239-1.2.1.1-wtS_zQdkr9rmosIfeRE7o6CF1lol2IjECKCLRsZxbc2STvipGIcFKyNkVRGk3_RU1YDb9id8sQ9agwfwP535wbwbHFAo6H7PBrWU_U0wfjkFM4j5MquJ49NBCt6mlyFglUaO7WBgOgpiwwd9IZhWHkOsgX1chSYbGijEWvqPILNRNuUlGZJgIugjFbM1TuJ5266y503YA1UWMb6cZH8C8KvawmcLL9qD1ObOMh88mbWPYNDcG_CWMcF5bLLBDwTmmFjV0aiEViSz15J5unUfo0XgnETkkBnNvGqqPVJsjKcKeGThS2THdl9Mcqk8lyWY3ploWeXyFrsr8yUEy6NZUT7fw4KqDS_NG8lmycaGt3HTyzT.xF16wtPsBYhi2Cz909nVqR4bfWGvInYfEpf9YzxkZQy0yYzBdIoC9xmCFkkbgcUC95NwWdd0wFLdJD4X";

