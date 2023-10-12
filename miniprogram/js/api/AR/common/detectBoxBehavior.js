//顶点着色器
var VSHADER_SOURCE = '' +
    'attribute vec4 a_Position;\n' + //声明attribute变量a_Position，用来存放顶点位置信息
    'void main(){\n' +
    '  gl_Position = a_Position;\n' + //将顶点坐标赋值给顶点着色器内置变量gl_Position
    '  gl_PointSize = 4.0;\n' + //设置顶点大小
    '}\n'

//片元着色器
var FSHADER_SOURCE = '' +
    '#ifdef GL_ES\n' +
    ' precision mediump float;\n' + // 设置精度
    '#endif\n' +
    'varying vec4 v_Color;\n' + //声明varying变量v_Color，用来接收顶点着色器传送的片元颜色信息
    'void main(){\n' +
    '  float d = distance(gl_PointCoord, vec2(0.5, 0.5));\n' + //计算像素距离中心点的距离
    '  if(d < 0.5) {\n' + //距离大于0.5放弃片元，小于0.5保留片元
    '    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
    '  } else { discard; }\n' +
    '}\n'

var EDGE_VSHADER_SOURCE =
 `
attribute vec2 aPosition; 
varying vec2 posJudge;

void main(void) {
gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
posJudge = aPosition;
}
`

var EDGE_FSHADER_SOURCE =
`
precision highp float;
uniform vec2 rightTopPoint;
uniform vec2 centerPoint;
varying vec2 posJudge;

float box(float x, float y){
float xc = x - centerPoint.x;
float yc = y - centerPoint.y;
vec2 point = vec2(xc, yc);
float right = rightTopPoint.x;
float top =  rightTopPoint.y;
float line_width = 0.01;
vec2 b1 = 1.0 - step(vec2(right,top), abs(point));
float outer = b1.x * b1.y;
vec2 b2 = 1.0 - step(vec2(right-line_width,top-line_width), abs(point));
float inner = b2.x * b2.y;
return outer - inner;
}

void main(void) {
if(box(posJudge.x, posJudge.y) == 0.0 ) discard;

gl_FragColor = vec4(box(posJudge.x, posJudge.y), 0.0, 0.0, 1.0);

}
`


const detectBoxBehavior = {
    data:{
        initShadersDone: false
    },
    methods: {
        //初始化着色器函数

        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE) {
            //创建顶点着色器对象
            var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, VSHADER_SOURCE)
            //创建片元着色器对象
            var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, FSHADER_SOURCE)

            if (!vertexShader || !fragmentShader) {
                return null
            }

            //创建程序对象program
            var program = gl.createProgram()
            if (!gl.createProgram()) {
                return null
            }
            //分配顶点着色器和片元着色器到program
            gl.attachShader(program, vertexShader)
            gl.attachShader(program, fragmentShader)
            //链接program
            gl.linkProgram(program)

            //检查程序对象是否连接成功
            var linked = gl.getProgramParameter(program, gl.LINK_STATUS)
            if (!linked) {
                var error = gl.getProgramInfoLog(program)
                console.log('程序对象连接失败: ' + error)
                gl.deleteProgram(program)
                gl.deleteShader(fragmentShader)
                gl.deleteShader(vertexShader)
                return null
            }

            //返回程序program对象
            this.setData({
                initShadersDone: true
            })
            return program
        },

        loadShader(gl, type, source) {
            // 创建顶点着色器对象
            var shader = gl.createShader(type)
            if (shader == null) {
                console.log('创建着色器失败')
                return null
            }

            // 引入着色器源代码
            gl.shaderSource(shader, source)

            // 编译着色器
            gl.compileShader(shader)

            // 检查顶是否编译成功
            var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
            if (!compiled) {
                var error = gl.getShaderInfoLog(shader)
                console.log('编译着色器失败: ' + error)
                gl.deleteShader(shader)
                return null
            }

            return shader
        },
        //初始化顶点坐标和顶点颜色
        initVertexBuffers(gl, anchor2DList) {
            const flattenPoints = []
            anchor2DList.forEach(anchor => {
                anchor.points.forEach(point => {
                    const {
                        x,
                        y
                    } = point
                    flattenPoints.push(x * 2 - 1, 1 - y * 2)
                })
            })

            var vertices = new Float32Array(flattenPoints)
            var n = flattenPoints.length / 2

            //创建缓冲区对象
            var buffer = gl.createBuffer()
            //将顶点坐标和顶点颜色信息写入缓冲区对象
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

            //获取顶点着色器attribute变量a_Position存储地址, 分配缓存并开启
            var a_Position = gl.getAttribLocation(gl.program, 'a_Position')
            gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
            gl.enableVertexAttribArray(a_Position)
            return n
        },
        initRectEdgeBuffer(gl, x, y, width, height) {
            let shaderProgram = gl.program;
            let centerX = x * 2 - 1 + width;
            let centerY = -1 * (y * 2 - 1) - height;
            let right = width;
            let top = height;
            var vertices = [
                -1.0, 1.0,
                -1.0, -1.0,
                1.0, 1.0,
                1.0, -1.0
            ];

            var vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            var aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
            gl.enableVertexAttribArray(aPosition);
            gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);


            var rightTop = [
                right, top
            ];
            var rightTopLoc = gl.getUniformLocation(shaderProgram, 'rightTopPoint');
            gl.uniform2fv(rightTopLoc, rightTop);

            var centerPoint = [
                centerX, centerY
            ];
            var centerPointLoc = gl.getUniformLocation(shaderProgram, 'centerPoint');
            gl.uniform2fv(centerPointLoc, centerPoint);

            var length = vertices.length / 2;

            return length;
        },
        onDrawRectEdge(gl, x, y, width, height) {
            width = Math.round(width * 100) / 100
            height = Math.round(height * 100) / 100
            var n = this.initRectEdgeBuffer(gl, x, y, width, height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        }
    },
}


module.exports = {
    detectBoxBehavior, 
    VSHADER_SOURCE, 
    FSHADER_SOURCE, 
    EDGE_VSHADER_SOURCE, 
    EDGE_FSHADER_SOURCE
};