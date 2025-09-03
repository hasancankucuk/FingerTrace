import SparkMD5 from 'spark-md5';
import type { WebGLBufferWithItems } from '../../models/index';

const getWebglContext = (): WebGLRenderingContext | null => {
    const canvas = document.createElement('canvas');
    return (canvas.getContext('webgl') ||
            canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
};

export function generateWebGLHash(): { hash: string; rawData: string | null } | null {
    const gl = getWebglContext();
    if (!gl) return null;

    const result: string[] = [];

    // ---- shader setup ----
    const vShaderTemplate = `
        attribute vec2 attrVertex;
        varying vec2 varyinTexCoordinate;
        uniform vec2 uniformOffset;
        void main() {
            varyinTexCoordinate = attrVertex + uniformOffset;
            gl_Position = vec4(attrVertex, 0, 1);
        }`;
    const fShaderTemplate = `
        precision mediump float;
        varying vec2 varyinTexCoordinate;
        void main() {
            gl_FragColor = vec4(varyinTexCoordinate, 0, 1);
        }`;

    const vertexPosBuffer = gl.createBuffer() as WebGLBufferWithItems;
    if (!vertexPosBuffer) return null;

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    const vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;

    const program = gl.createProgram();
    if (!program) return null;

    const vshader = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);

    const fshader = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);

    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('WebGL program link error: ', gl.getProgramInfoLog(program));
        return null;
    }

    gl.useProgram(program);

    const vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
    const offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
    if (vertexPosAttrib === -1 || !offsetUniform) return null;

    gl.enableVertexAttribArray(vertexPosAttrib);
    gl.vertexAttribPointer(vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
    gl.uniform2f(offsetUniform, 1, 1);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);

    try {
        const canvas = gl.canvas as HTMLCanvasElement;
        if (canvas.toDataURL) {
            result.push(canvas.toDataURL());
        }
    } catch (e) {
        console.warn('Canvas toDataURL error: ', e);
    }

    // ---- vendor/renderer (safe!) ----
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
        const vendorConst = debugInfo.UNMASKED_VENDOR_WEBGL;
        const rendererConst = debugInfo.UNMASKED_RENDERER_WEBGL;
        try {
            const vendor = gl.getParameter(vendorConst);
            const renderer = gl.getParameter(rendererConst);
            if (vendor) result.push(String(vendor));
            if (renderer) result.push(String(renderer));
        } catch (e) {
            console.warn('Vendor/Renderer not accessible: ', e);
        }
    }

    const combined = result.join('||');
    return {
        hash: SparkMD5.hash(combined),
        rawData: combined || null,
    };
}