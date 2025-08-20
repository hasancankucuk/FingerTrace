export const getWebGLShaderPrecision = (): Record<string, any> | null => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") as WebGLRenderingContext | null;

    if (!gl) {
        // Skip warning in test environment
        if (process.env.NODE_ENV !== 'test') {
            console.warn("WebGL not supported.");
        }
        return null;
    }

    const webGLShaderPrecision: Record<string, any> = {
        IsShader: true
    };

    const shaderTypes = {
        VertexShader: gl.VERTEX_SHADER,
        FragmentShader: gl.FRAGMENT_SHADER,
    };

    const precisions = {
        LowFloat: gl.LOW_FLOAT,
        MediumFloat: gl.MEDIUM_FLOAT,
        HighFloat: gl.HIGH_FLOAT,
        LowInt: gl.LOW_INT,
        MediumInt: gl.MEDIUM_INT,
        HighInt: gl.HIGH_INT,
    };

    for (const [shaderName, shaderType] of Object.entries(shaderTypes)) {
        for (const [precisionName, precisionType] of Object.entries(precisions)) {
            const precisionFormat = gl.getShaderPrecisionFormat(shaderType, precisionType);

            if (precisionFormat) {
                webGLShaderPrecision[`${shaderName}${precisionName}Precision`] = precisionFormat.precision.toString();
                webGLShaderPrecision[`${shaderName}${precisionName}RangeMin`] = precisionFormat.rangeMin.toString();
                webGLShaderPrecision[`${shaderName}${precisionName}RangeMax`] = precisionFormat.rangeMax.toString();
            } else {
                console.warn(`Could not retrieve ${shaderName} ${precisionName} precision format.`);
                webGLShaderPrecision[`${shaderName}${precisionName}Precision`] = "N/A";
                webGLShaderPrecision[`${shaderName}${precisionName}RangeMin`] = "N/A";
                webGLShaderPrecision[`${shaderName}${precisionName}RangeMax`] = "N/A";
            }
        }
    }

    return webGLShaderPrecision;
};