export const getWebGLRendererInfo = (): { vendor: string, renderer: string } | null => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null
        || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) {
        // Skip warning in test environment
        if (process.env.NODE_ENV !== 'test') {
            console.warn("WebGL not supported.");
        }
        return null;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    if (debugInfo) {
        const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

        return {
            vendor: vendor || 'Unknown Vendor',
            renderer: renderer || 'Unknown Renderer'
        };
    } else {
        console.warn('WEBGL_debug_renderer_info not available');
        return null;
    }
}