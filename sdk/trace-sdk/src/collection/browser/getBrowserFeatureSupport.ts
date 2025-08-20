export const getBrowserFeatureSupport = (): object => {
    const hasCSS = typeof CSS !== 'undefined';
    const hasWindow = typeof window !== 'undefined';
    const hasNavigator = typeof navigator !== 'undefined';

    return {
        Fetch: hasWindow && 'fetch' in window,
        WebXr: hasNavigator && 'xr' in navigator,
        OsCpu: hasNavigator && 'oscpu' in navigator,
        WebRTC: hasWindow && 'RTCPeerConnection' in window,
        OnLine: hasNavigator && navigator.onLine,
        Gamepad: hasNavigator && 'getGamepads' in navigator,
        Cookies: hasNavigator && navigator.cookieEnabled,
        WebWorker: typeof Worker !== 'undefined',
        IndexedDb: hasWindow && 'indexedDB' in window,
        PdfViewer: hasWindow && 'PDFViewerApplication' in window,
        ImageBitmap: hasWindow && 'createImageBitmap' in window,
        WebAssembly: hasWindow && 'WebAssembly' in window,
        Performance: hasWindow && 'performance' in window,
        AudioWorklet: hasWindow && 'AudioWorklet' in window,
        PluginSupport: hasNavigator && 'plugins' in navigator,
        ServiceWorker: hasNavigator && 'serviceWorker' in navigator,
        IsTouchScreen: hasWindow && ('ontouchstart' in window || navigator.maxTouchPoints > 0),
        LocalStorage: hasWindow && 'localStorage' in window,
        IsJavaEnabled: hasNavigator && navigator.javaEnabled && navigator.javaEnabled(),
        PaintWorklet: hasCSS && 'PaintWorklet' in CSS,
        CryptoSupport: hasWindow && 'crypto' in window,
        UserActivation: hasNavigator && 'userActivation' in navigator,
        OffScreenCanvas: hasWindow && 'OffscreenCanvas' in window,
        BroadCastChannel: hasWindow && 'BroadcastChannel' in window,
        AnimationWorklet: hasCSS && 'AnimationWorklet' in CSS,
        Battery: hasNavigator && 'getBattery' in navigator ? null : 'Battery not supported'
    };
}
