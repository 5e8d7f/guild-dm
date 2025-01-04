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

export { DiscordUser, JoinRequest, RateLimitResponse, JoinRequestsResponse, InterviewResponse, MessageResponse };