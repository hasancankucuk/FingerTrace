export const canPlay = (playType: string): string => {
    // Mock video element for test environment
    if (process.env.NODE_ENV === 'test') {
        return '';
    }

    const videoElement = document.createElement('video');
    return videoElement.canPlayType(`video/${playType}`) || '';
}