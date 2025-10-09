export interface SessionMetrics {
    total_sessions: number;
    avg_session_duration: number;
    total_messages: number;
    avg_response_time: number;
    active_users: number;
    top_intents: Record<string, number>;
}

export interface UserSegmentation {
    segments: Record<string, number>;
    recommendations: Record<string, string>;
    visualization?: string;
}