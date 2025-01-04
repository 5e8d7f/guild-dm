import { setTimeout } from 'timers/promises';
import {
    API_ENDPOINT,
    AUTH_TOKEN,
    MESSAGE,
    MAX_RETRIES,
    INITIAL_RETRY_DELAY,
    RATE_LIMIT_DELAY,
    REQUESTS_PER_PAGE,
    INTER_REQUEST_DELAY,
    INTER_BATCH_DELAY,
    ERROR_RETRY_DELAY,
    API_HEADERS,
    COOKIE
} from './config';

interface DiscordUser {
    id: string;
    username: string;
    global_name?: string;
}

interface JoinRequest {
    id: string;
    user: DiscordUser;
}

interface RateLimitResponse {
    retry_after: number;
    global: boolean;
    message: string;
}

interface JoinRequestsResponse {
    guild_join_requests: JoinRequest[];
}

interface InterviewResponse {
    id: string;
    type: number;
    last_message_id: string | null;
}

interface MessageResponse {
    id: string;
    content: string;
    channel_id: string;
}

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

async function makeRequest<T>(url: string, options: RequestInit, maxRetries: number = MAX_RETRIES): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...API_HEADERS,
                    "authorization": AUTH_TOKEN,
                    "cookie": COOKIE,
                    ...options.headers
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
            await setTimeout(INITIAL_RETRY_DELAY * Math.pow(2, attempt));
        }
    }
    throw new Error('Max retries exceeded');
}

async function fetchJoinRequests(before: string | null = null): Promise<JoinRequestsResponse> {
    const url = before ?
        `${API_ENDPOINT}?status=SUBMITTED&limit=${REQUESTS_PER_PAGE}&before=${before}` :
        `${API_ENDPOINT}?status=SUBMITTED&limit=${REQUESTS_PER_PAGE}`;

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
            await setTimeout(INTER_REQUEST_DELAY);
            await sendMessage(channelId, MESSAGE);
            await setTimeout(INTER_REQUEST_DELAY);
        } catch (error) {
            console.error(`Failed to process applicant ${applicant.user.username}:`,
                error instanceof Error ? error.message : 'Unknown error');
            if (error instanceof Error && error.message.includes('429')) {
                await setTimeout(RATE_LIMIT_DELAY);
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
            await setTimeout(INTER_BATCH_DELAY);
        } catch (error) {
            console.error('An error occurred:', error instanceof Error ? error.message : 'Unknown error');
            await setTimeout(ERROR_RETRY_DELAY);
        }
    }

    console.log(`Finished processing all applicants. Total processed: ${totalProcessed}`);
}

main().catch(console.error);

