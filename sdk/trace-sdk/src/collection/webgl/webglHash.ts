import * as SparkMD5 from 'spark-md5';
import type { WebGLBufferWithItems } from '../../models/index';


const getWebglHash = (): WebGLRenderingContext | null => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    let gl: WebGLRenderingContext | null = null;
    try {
        gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    } catch (e) {
        console.log('Error: ', e);
    }
    if (!gl) {
        gl = null;
    }
    return gl;
};

export function generateWebGLHash(): { hash: string, rawData: string | null } | null {
    const gl = getWebglHash();
    if (!gl) {
        return null;
    }

    const result: string[] = [];
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
            gl.FragColor = vec4(varyinTexCoordinate, 0, 1);
        }`;

    const vertexPosBuffer = gl.createBuffer() as WebGLBufferWithItems;
    if (!vertexPosBuffer) {
        return null;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    const vertices = new Float32Array([-0.2, -0.9, 0, 0.4, -0.26, 0, 0, 0.732134444, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    vertexPosBuffer.itemSize = 3;
    vertexPosBuffer.numItems = 3;

    const program = gl.createProgram();
    if (!program) {
        return null;
    }
    const vshader = gl.createShader(gl.VERTEX_SHADER);
    if (!vshader) {
        return null;
    }
    gl.shaderSource(vshader, vShaderTemplate);
    gl.compileShader(vshader);

    const fshader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fshader) {
        return null;
    }
    gl.shaderSource(fshader, fShaderTemplate);
    gl.compileShader(fshader);

    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertexPosAttrib = gl.getAttribLocation(program, 'attrVertex');
    const offsetUniform = gl.getUniformLocation(program, 'uniformOffset');
    if (vertexPosAttrib === -1 || !offsetUniform) {
        return null;
    }

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
        console.log('Error: ', e);
    }

    return {
        hash: SparkMD5.hash(result[0]),
        rawData: result[0] || null
    };
}
