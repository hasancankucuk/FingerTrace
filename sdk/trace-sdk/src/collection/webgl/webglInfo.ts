export const getWebGLInfo = (): Record<string, any> | null => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

    if (!gl) {
        // Skip warning in test environment
        if (process.env.NODE_ENV !== 'test') {
            console.warn("WebGL not supported.");
        }
        return null;
    }

    const webGLInfo: Record<string, any> = {};

    // Retrieve WebGL extensions
    webGLInfo.Extensions = gl.getSupportedExtensions() || [];

    // Retrieve WebGL parameters
    const extensionParameters: string[] = [];
    const params = {
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
        "MAX_ANISOTROPY_EXT": "EXT_texture_filter_anisotropic" in webGLInfo.Extensions ? gl.getParameter(gl.getExtension("EXT_texture_filter_anisotropic")?.MAX_TEXTURE_MAX_ANISOTROPY_EXT!) : null,
    };

    for (const [key, value] of Object.entries(params)) {
        const paramValue = gl.getParameter(value);
        extensionParameters.push(`${key}=${paramValue}`);
    }
    webGLInfo.ExtensionParameters = extensionParameters;

    // Additional WebGL info
    webGLInfo.WidthRange = gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE);
    webGLInfo.PointSize = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    webGLInfo.ImageUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    webGLInfo.CubeTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
    webGLInfo.ViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
    webGLInfo.AlphaBits = gl.getParameter(gl.ALPHA_BITS);
    webGLInfo.GreenBits = gl.getParameter(gl.GREEN_BITS);
    webGLInfo.BlueBits = gl.getParameter(gl.BLUE_BITS);
    webGLInfo.DepthBits = gl.getParameter(gl.DEPTH_BITS);
    webGLInfo.RedBits = gl.getParameter(gl.RED_BITS);
    webGLInfo.UniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    webGLInfo.RenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
    webGLInfo.TextureImageUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    webGLInfo.TextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    webGLInfo.VaryingVectors = gl.getParameter(gl.MAX_VARYING_VECTORS);
    webGLInfo.VertexAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
    webGLInfo.VertexTextureImageUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
    webGLInfo.VertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
    webGLInfo.StencilBits = gl.getParameter(gl.STENCIL_BITS);
    webGLInfo.ShadingLang = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    webGLInfo.Version = gl.getParameter(gl.VERSION);
    webGLInfo.MaxAnistropy = gl.getParameter(gl.getExtension("EXT_texture_filter_anisotropic")?.MAX_TEXTURE_MAX_ANISOTROPY_EXT! || 1.0);
    webGLInfo.AntiAlias = gl.getContextAttributes()?.antialias ? 1 : 0;

    return webGLInfo;
};

