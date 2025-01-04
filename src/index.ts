import { setTimeout } from 'timers/promises';
import type { RateLimitResponse, JoinRequestsResponse, InterviewResponse, MessageResponse, JoinRequest } from './types/discord';

const GUILD_IDS = ['1249569936221929585', '1138670083321905212', '1264444617231695945']
const USER_ID = '944681603609804871'; // v992
const TOKEN = 'MTIwMTYwNzc1MDQ0MzA4NjAwNQ.Ghk0Hw.U-HnZ7W1AxQu9GCH81wLvEkm6c8VVw5UafhPNs'; // 'MTk4NjQ4NjQwNjQwNjQwNjQw.Y...'
const MESSAGE = `
Ways to join the guild

- invite 2 people to the server
- pay 10$ for lifetime 
- boost

you can do whatever of those options you want 

discord.gg/louu you need to join louu if your not in it i cant accept
`;

/**
 * Handles rate limiting by waiting for the specified time if a 429 status is received.
 * @param {Response} response - The response from the API call
 * @returns {Promise<boolean>} - Returns true if rate limited, false otherwise
 */
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

/**
 * Makes an API request with retry logic and rate limit handling.
 * @template T
 * @param {string} url - The URL to make the request to
 * @param {RequestInit} options - The options for the fetch request
 * @param {number} [maxRetries=3] - The maximum number of retry attempts
 * @returns {Promise<T>} - The parsed JSON response
 * @throws {Error} - Throws an error if the request fails after all retries
 */
async function makeRequest<T>(url: string, options: RequestInit, maxRetries: number = 3): Promise<T> {
    const headers = {
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
        "Referer": `https://canary.discord.com/channels/@me/${USER_ID}`,
        "Referrer-Policy": "strict-origin-when-cross-origin",
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, { ...options, headers });

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

/**
 * Fetches join requests for the guild.
 * @param {string | null} [before=null] - The ID to paginate before
 * @param {string} guild_id - The ID of the guild to fetch join requests for
 * @returns {Promise<JoinRequestsResponse>} - The join requests response
 */
async function fetchJoinRequests(before: string | null = null, guild_id: string): Promise<JoinRequestsResponse> {
    const url = new URL(`https://canary.discord.com/api/v9/guilds/${guild_id}/requests`);
    url.searchParams.append('status', 'SUBMITTED');
    url.searchParams.append('limit', '100');
    if (before) url.searchParams.append('before', before);
    return makeRequest<JoinRequestsResponse>(url.toString(), { method: 'GET' });
}

/**
 * Initiates an interview with an applicant.
 * @param {string} userId - The ID of the user to interview
 * @returns {Promise<string>} - The ID of the interview channel
 */
async function interviewApplicant(userId: string): Promise<string> {
    const url = `https://canary.discord.com/api/v9/join-requests/${userId}/interview`;
    const response = await makeRequest<InterviewResponse>(url, { method: 'POST' });
    return response.id;
}

/**
 * Sends a message to a Discord channel.
 * @param {string} channelId - The ID of the channel to send the message to
 * @param {string} message - The message content to send
 * @returns {Promise<MessageResponse>} - The response from sending the message
 */
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

/**
 * Processes a batch of applicants by interviewing them and sending a message.
 * @param {JoinRequest[]} applicants - The array of applicants to process
 */
async function processApplicants(applicants: JoinRequest[]): Promise<void> {
    for (const applicant of applicants) {
        try {
            console.log(`Processing applicant: ${applicant.user.username}`);
            const channelId = await interviewApplicant(applicant.id);
            await sendMessage(channelId, MESSAGE);
            await setTimeout(500);
        } catch (error) {
            console.error(`Failed to process applicant ${applicant.user.username}:`,
                error instanceof Error ? error.message : 'Unknown error');
            if (error instanceof Error && error.message.includes('429')) {
                await setTimeout(5000);
            }
        }
    }
}
/**
 * Main function to process all join requests with pagination.
 */
async function main(): Promise<void> {
    const processedUsers = new Set<string>();
    let totalProcessed = 0;

    while (true) {
        try {
            for (const GUILD_ID of GUILD_IDS) {
                const data = await fetchJoinRequests(null, GUILD_ID);
                if (!data.guild_join_requests || data.guild_join_requests.length === 0) {
                    console.log(`No join requests found for guild ${GUILD_ID}`);
                    continue;
                }

                const newApplicants = data.guild_join_requests.filter(
                    applicant => !processedUsers.has(applicant.id)
                );

                if (newApplicants.length > 0) {
                    await processApplicants(newApplicants);
                    newApplicants.forEach(applicant => processedUsers.add(applicant.id));
                    totalProcessed += newApplicants.length;
                    console.log(`Processed ${totalProcessed} total applicants (${newApplicants.length} new)`);
                }
            }

            await setTimeout(15000);
        } catch (error) {
            console.error('An error occurred:', error instanceof Error ? error.message : 'Unknown error');
            await setTimeout(15000);
        }
    }
}

main().catch(console.error);