const isIOSHighPerformanceModePlus = !!GameGlobal.isIOSHighPerformanceModePlus;
var vs = "\n  attribute vec3 aPos;\n  attribute vec2 aVertexTextureCoord;\n  varying highp vec2 vTextureCoord;\n\n  void main(void){\n    gl_Position = vec4(aPos, 1);\n    vTextureCoord = aVertexTextureCoord;\n  }\n";
var fs = "\n  varying highp vec2 vTextureCoord;\n  uniform sampler2D uSampler;\n\n  void main(void) {\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n  }\n";
var buffers = {};
var vertex = [
    -1, -1, 0.0,
    1, -1, 0.0,
    1, 1, 0.0,
    -1, 1, 0.0,
];
var vertexIndice = [
    0, 1, 2,
    0, 2, 3,
];
var texCoords = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];
function createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader: " + gl.getShaderInfoLog(shader));
    }
    return shader;
}
export default function createRenderer(canvas) {
    var gl = canvas.getContext('webgl');
    if (!gl) {
        console.error('Unable to get webgl context.');
        return;
    }
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    var vertexShader = createShader(gl, vs, gl.VERTEX_SHADER);
    var fragmentShader = createShader(gl, fs, gl.FRAGMENT_SHADER);
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program.');
        return;
    }
    gl.useProgram(program);
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_2D, null);
    buffers.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
    buffers.vertexIndiceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.vertexIndiceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertexIndice), gl.STATIC_DRAW);
    var aVertexPosition = gl.getAttribLocation(program, 'aPos');
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);
    buffers.trianglesTexCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.trianglesTexCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
    var vertexTexCoordAttribute = gl.getAttribLocation(program, 'aVertexTextureCoord');
    gl.enableVertexAttribArray(vertexTexCoordAttribute);
    gl.vertexAttribPointer(vertexTexCoordAttribute, 2, gl.FLOAT, false, 0, 0);
    var samplerUniform = gl.getUniformLocation(program, 'uSampler');
    gl.uniform1i(samplerUniform, 0);
    return function (arrayBuffer, width, height) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (isIOSHighPerformanceModePlus) {
          // 高性能+只能使用6参数版本
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, arrayBuffer);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8ClampedArray(arrayBuffer));
        }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
}

