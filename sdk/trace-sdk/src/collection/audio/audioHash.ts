
export const getAudioHash = (() => {
    let context: OfflineAudioContext | null = null;
    let currentTime: number | null = null;
    let oscillator: OscillatorNode | null = null;
    let compressor: DynamicsCompressorNode | null = null;
    let fingerprint: string | null = null;
    let callback: ((fingerprint: string) => void) | null = null;

    const run = (cb: (fingerprint: string) => void, debug: boolean = false) => {
        callback = cb;

        try {
            setup();

            if (oscillator && compressor && context) {
                oscillator.connect(compressor);
                compressor.connect(context.destination);
                
                oscillator.start(0);
                context.startRendering().then(onComplete).catch(e => {
                    if (debug) {
                        throw e;
                    }
                });
            }
        } catch (e) {
            if (debug) {
                throw e;
            }
            // Return a fallback fingerprint if audio context fails
            if (callback) {
                callback("0");
            }
        }
    };

    const setup = () => {
        setContext();
        currentTime = context?.currentTime ?? 0;
        setOscillator();
        setCompressor();
    };

    const setContext = () => {
        try {
            context = new OfflineAudioContext(1, 44100, 44100);
        } catch (e) {
            context = null;
        }
    };

    const setOscillator = () => {
        if (context && currentTime !== null) {
            oscillator = context.createOscillator();
            oscillator.type = "triangle";
            oscillator.frequency.setValueAtTime(10000, currentTime);
        }
    };

    const setCompressor = () => {
        if (context) {
            compressor = context.createDynamicsCompressor();
            setCompressorValueIfDefined('threshold', -50);
            setCompressorValueIfDefined('knee', 40);
            setCompressorValueIfDefined('ratio', 12);
            setCompressorValueIfDefined('attack', 0);
            setCompressorValueIfDefined('release', 0.25);
        }
    };

    const setCompressorValueIfDefined = (property: keyof DynamicsCompressorNode, value: number) => {
        const audioParam = compressor?.[property] as AudioParam;
        if (audioParam && typeof audioParam.setValueAtTime === 'function') {
            audioParam.setValueAtTime(value, context!.currentTime);
        }
    };

    const onComplete = (renderedBuffer: AudioBuffer) => {
        generateFingerprints(renderedBuffer);
        cleanup();
    };

    const cleanup = () => {
        if (compressor) {
            compressor.disconnect();
        }
        if (oscillator) {
            oscillator.disconnect();
        }
        context = null;
    };

    const generateFingerprints = (renderedBuffer: AudioBuffer) => {
        let output = 0;
        const channelData = renderedBuffer.getChannelData(0);

        for (let i = 4500; i < 5000; i++) {
            output += Math.abs(channelData[i]);
        }

        fingerprint = output.toString();

        if (typeof callback === 'function') {
            callback(fingerprint);
        }
    };

    return {
        run
    };
})();