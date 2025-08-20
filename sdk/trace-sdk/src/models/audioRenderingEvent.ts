export interface AudioRenderingEvent {
    // Timestamp when the audio rendering occurred
    timestamp: number;
    
    // Audio context time
    time: number;
    
    // Audio processing state
    state: 'started' | 'running' | 'suspended' | 'closed';
    
    // Buffer size
    bufferSize: number;
    
    // Sample rate in Hz
    sampleRate: number;
    
    // Channel count
    numberOfChannels: number;
    
    // Audio data
    audioData?: Float32Array[];
}