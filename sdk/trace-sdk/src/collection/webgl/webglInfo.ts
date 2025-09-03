export const getWebGLInfo = (): Record<string, any> | null => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

    if (!gl) {
        if (process.env.NODE_ENV !== "test") {
            console.warn("WebGL not supported.");
        }
        return null;
    }

    const webGLInfo: Record<string, any> = {};
    webGLInfo.Extensions = gl.getSupportedExtensions() || [];

    const params: Record<string, number> = {
        "ALIASED_LINE_WIDTH_RANGE": gl.ALIASED_LINE_WIDTH_RANGE,
        "ALIASED_POINT_SIZE_RANGE": gl.ALIASED_POINT_SIZE_RANGE,
        "MAX_TEXTURE_SIZE": gl.MAX_TEXTURE_SIZE,
        "MAX_CUBE_MAP_TEXTURE_SIZE": gl.MAX_CUBE_MAP_TEXTURE_SIZE,
        "MAX_RENDERBUFFER_SIZE": gl.MAX_RENDERBUFFER_SIZE,
        "MAX_VIEWPORT_DIMS": gl.MAX_VIEWPORT_DIMS,
        "MAX_VERTEX_ATTRIBS": gl.MAX_VERTEX_ATTRIBS,
        "MAX_VERTEX_UNIFORM_VECTORS": gl.MAX_VERTEX_UNIFORM_VECTORS,
        "MAX_VARYING_VECTORS": gl.MAX_VARYING_VECTORS,
        "MAX_COMBINED_TEXTURE_IMAGE_UNITS": gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS,
        "MAX_VERTEX_TEXTURE_IMAGE_UNITS": gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS,
        "MAX_TEXTURE_IMAGE_UNITS": gl.MAX_TEXTURE_IMAGE_UNITS,
        "MAX_FRAGMENT_UNIFORM_VECTORS": gl.MAX_FRAGMENT_UNIFORM_VECTORS,
    };

    const extensionParameters: string[] = [];
    for (const [key, enumConst] of Object.entries(params)) {
        try {
            const value = gl.getParameter(enumConst as number);
            extensionParameters.push(`${key}=${value}`);
        } catch {
            extensionParameters.push(`${key}=unavailable`);
        }
    }

    // Handle anisotropy separately (don’t put it in params!)
    let maxAniso: any = null;
    const ext = gl.getExtension("EXT_texture_filter_anisotropic");
    if (ext) {
        try {
            maxAniso = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        } catch {
            maxAniso = null;
        }
    }
    extensionParameters.push(`MAX_ANISOTROPY_EXT=${maxAniso}`);

    webGLInfo.ExtensionParameters = extensionParameters;

    // Example of additional safe parameters
    webGLInfo.AlphaBits = gl.getParameter(gl.ALPHA_BITS);
    webGLInfo.GreenBits = gl.getParameter(gl.GREEN_BITS);
    webGLInfo.BlueBits = gl.getParameter(gl.BLUE_BITS);
    webGLInfo.DepthBits = gl.getParameter(gl.DEPTH_BITS);
    webGLInfo.RedBits = gl.getParameter(gl.RED_BITS);
    webGLInfo.ShadingLang = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    webGLInfo.Version = gl.getParameter(gl.VERSION);
    webGLInfo.AntiAlias = gl.getContextAttributes()?.antialias ? 1 : 0;

    return webGLInfo;
};