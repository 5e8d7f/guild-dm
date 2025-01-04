import { setTimeout } from 'timers/promises';
import type { RateLimitResponse, JoinRequestsResponse, InterviewResponse, MessageResponse, JoinRequest } from './types/discord';

const GUILD_ID = '1138670083321905212';
const TOKEN = '';
const API_ENDPOINT = `https://canary.discord.com/api/v9/guilds/${GUILD_ID}/requests`
const MESSAGE = `
Ways to join the guild

- invite 2 people to the server
- pay 10$ for lifetime 
- boost

you can do whatever of those options you want 

discord.gg/louu you need to join louu if your not in it i cant accept
`

async function handleRateLimit(response: Response): Promise<boolean> {
    if (response.status === 429) {
        const data = await response.json() as RateLimitResponse;
        const retryAfter = data.retry_after * 1000;
        console.log(`Rate limited. Waiting ${retryAfter}ms before retrying...`);
        await setTimeout(retryAfter);
        return true;
    }
    return false;
}

async function makeRequest<T>(url: string, options: RequestInit, maxRetries: number = 3): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                    "accept": "*/*",
                    "accept-language": "en-US",
                    "authorization": TOKEN,
                    "content-type": "application/json",
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
                    "cookie": "__dcfduid=1eb586c0be0d11efa898d5e651b2a473; __sdcfduid=1eb586c1be0d11efa898d5e651b2a4733cbc59cd6d795e9a50449944462ac7eb322ac849cec5192b3fc7e3fd438d00ee; dbind=7de9e46e-58ea-4ad8-afb1-ba32dd3e0bac; __stripe_mid=26a00557-3574-4b86-99ae-752c6da0216179fe46; _cfuvid=Aa83GWMtqqeE4SgJIfMRzUxF.dnSg9..YyiXtgbqD4c-1735957847815-0.0.1.1-604800000; __cfruid=61dcc461287c2777f1c6487d91dd327e6ac4ae76-1735958053; cf_clearance=d6fQ_MpvxMeuEBHdEHgYjyI1rva51tEY9Q5xmexR0LQ-1735966239-1.2.1.1-wtS_zQdkr9rmosIfeRE7o6CF1lol2IjECKCLRsZxbc2STvipGIcFKyNkVRGk3_RU1YDb9id8sQ9agwfwP535wbwbHFAo6H7PBrWU_U0wfjkFM4j5MquJ49NBCt6mlyFglUaO7WBgOgpiwwd9IZhWHkOsgX1chSYbGijEWvqPILNRNuUlGZJgIugjFbM1TuJ5266y503YA1UWMb6cZH8C8KvawmcLL9qD1ObOMh88mbWPYNDcG_CWMcF5bLLBDwTmmFjV0aiEViSz15J5unUfo0XgnETkkBnNvGqqPVJsjKcKeGThS2THdl9Mcqk8lyWY3ploWeXyFrsr8yUEy6NZUT7fw4KqDS_NG8lmycaGt3HTyzT.xF16wtPsBYhi2Cz909nVqR4bfWGvInYfEpf9YzxkZQy0yYzBdIoC9xmCFkkbgcUC95NwWdd0wFLdJD4X",
                    "Referer": `https://canary.discord.com/channels/@me/${GUILD_ID}`,
                    "Referrer-Policy": "strict-origin-when-cross-origin",
                }
            });

            if (await handleRateLimit(response)) {
                continue;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json() as T;
        } catch (error) {
            if (attempt === maxRetries - 1) throw error;
            console.error(`Attempt ${attempt + 1} failed:`, error instanceof Error ? error.message : 'Unknown error');
            await setTimeout(1000 * Math.pow(2, attempt));
        }
    }
    throw new Error('Max retries exceeded');
}

async function fetchJoinRequests(before: string | null = null): Promise<JoinRequestsResponse> {
    const url = before ?
        `${API_ENDPOINT}?status=SUBMITTED&limit=100&before=${before}` :
        `${API_ENDPOINT}?status=SUBMITTED&limit=100`;

    return makeRequest<JoinRequestsResponse>(url, { method: 'GET' });
}

async function interviewApplicant(userId: string): Promise<string> {
    const url = `https://canary.discord.com/api/v9/join-requests/${userId}/interview`;
    const response = await makeRequest<InterviewResponse>(url, { method: 'POST' });
    return response.id;
}

async function sendMessage(channelId: string, message: string): Promise<MessageResponse> {
    const url = `https://canary.discord.com/api/v9/channels/${channelId}/messages`;
    return makeRequest<MessageResponse>(url, {
        method: 'POST',
        body: JSON.stringify({
            content: message,
            nonce: Date.now().toString(),
            tts: false,
            flags: 0
        })
    });
}

async function processApplicants(applicants: JoinRequest[]): Promise<void> {
    for (const applicant of applicants) {
        try {
            console.log(`Processing applicant: ${applicant.user.username}`);
            const channelId = await interviewApplicant(applicant.id);
            await setTimeout(1000);
            await sendMessage(channelId, MESSAGE);
            await setTimeout(1000);
        } catch (error) {
            console.error(`Failed to process applicant ${applicant.user.username}:`,
                error instanceof Error ? error.message : 'Unknown error');
            if (error instanceof Error && error.message.includes('429')) {
                await setTimeout(5000);
            }
        }
    }
}

async function main(): Promise<void> {
    let before: string | null = null;
    let totalProcessed = 0;

    while (true) {
        try {
            const data = await fetchJoinRequests(before);

            if (!data.guild_join_requests || data.guild_join_requests.length === 0) {
                console.log('No more join requests found.');
                break;
            }

            await processApplicants(data.guild_join_requests);

            totalProcessed += data.guild_join_requests.length;
            console.log(`Processed ${totalProcessed} applicants so far.`);

            before = data.guild_join_requests[data.guild_join_requests.length - 1].id;
            await setTimeout(5000);
        } catch (error) {
            console.error('An error occurred:', error instanceof Error ? error.message : 'Unknown error');
            await setTimeout(30000);
        }
    }

    console.log(`Finished processing all applicants. Total processed: ${totalProcessed}`);
}

main().catch(console.error);