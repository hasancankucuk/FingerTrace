export interface OfflineAudioCompletionEvent {
    // The rendered audio buffer
    renderedBuffer: AudioBuffer;
    
    // Timestamp when rendering completed
    timestamp: number;
    
    // Total rendering duration in seconds
    duration: number;
    
    // Success status
    success: boolean;
}