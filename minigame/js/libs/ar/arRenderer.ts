/**
 * 统一 AR 渲染器
 *
 * 从旧版 minigame-demo AR/common/behavior + yuvBehavior + detectBoxBehavior + 各模块 renderComponent 合并而来。
 * 使用独立的离屏 WebGL Canvas 进行 Three.js + YUV + 人脸检测框渲染，
 * 然后通过 PIXI.Texture.fromCanvas() 将结果展示到 PIXI 舞台（避免与 PIXI 的 WebGL context 冲突）。
 *
 * 三种模式：
 *   - 'default'     : hitTest 点击位置放置 3D 模型（visionkit-basic/v2）
 *   - 'planeAR'     : reticle 光标 + hitTest 放置模型（plane-ar）
 *   - 'faceDetect'  : 人脸检测框绿点/红框渲染（face-detect）
 */

// gltf-clone 和 gltf-loader 是 TypeScript 模块，通过 import 引入（确保被 TS 编译器包含在分包中）
// threejs-miniprogram 是 vendor 目录下的 CommonJS JS 文件，在 initTHREE() 中延迟 require
import cloneGltf from './gltf-clone';
import { registerGLTFLoader } from './gltf-loader';

// ============== 着色器源码 ==============

// 人脸关键点顶点着色器（绿色圆点）
const VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main(){\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 4.0;\n' +
  '}\n';

// 人脸关键点片元着色器（绿色圆点）
const FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  ' precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main(){\n' +
  '  float d = distance(gl_PointCoord, vec2(0.5, 0.5));\n' +
  '  if(d < 0.5) {\n' +
  '    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);\n' +
  '  } else { discard; }\n' +
  '}\n';

// 人脸边框顶点着色器（红色矩形）
const EDGE_VSHADER_SOURCE = `
attribute vec2 aPosition;
varying vec2 posJudge;
void main(void) {
  gl_Position = vec4(aPosition.x, aPosition.y, 1.0, 1.0);
  posJudge = aPosition;
}
`;

// 人脸边框片元着色器（红色矩形）
const EDGE_FSHADER_SOURCE = `
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
`;

// YUV → RGB 着色器源码
const YUV_VS = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  uniform mat3 displayTransform;
  varying vec2 v_texCoord;
  void main() {
    vec3 p = displayTransform * vec3(a_position, 0);
    gl_Position = vec4(p, 1);
    v_texCoord = a_texCoord;
  }
`;

const YUV_FS = `
  precision highp float;
  uniform sampler2D y_texture;
  uniform sampler2D uv_texture;
  varying vec2 v_texCoord;
  void main() {
    vec4 y_color = texture2D(y_texture, v_texCoord);
    vec4 uv_color = texture2D(uv_texture, v_texCoord);
    float Y, U, V;
    float R, G, B;
    Y = y_color.r;
    U = uv_color.r - 0.5;
    V = uv_color.a - 0.5;
    R = Y + 1.402 * V;
    G = Y - 0.344 * U - 0.714 * V;
    B = Y + 1.772 * U;
    gl_FragColor = vec4(R, G, B, 1.0);
  }
`;

// RGBA 相机背景片元着色器（iOS 不支持 YUV 纹理扩展，用 RGBA 模式）
const RGBA_FS = `
  precision highp float;
  uniform sampler2D rgba_texture;
  varying vec2 v_texCoord;
  void main() {
    gl_FragColor = texture2D(rgba_texture, v_texCoord);
  }
`;

// 单位 3x3 矩阵（iOS RGBA 路径用）
const IDENTITY_MAT3 = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

// ============== 类型定义 ==============

export type ARMode = 'default' | 'planeAR' | 'faceDetect';

export interface ARConfig {
  track: { plane?: { mode: number }; face?: { mode: number } };
  cameraPosition?: number;
  version: string;
  gl?: any;
}

export interface ARRendererOptions {
  mode: ARMode;
  config: ARConfig;
  width: number;
  height: number;
  screenTop?: number;
  screenBottom?: number;
  onTouchEnd?: (x: number, y: number) => void;
  /** VKSession 启动成功后的回调（异步） */
  onReady?: () => void;
  /** VKSession 创建或启动失败的回调（同步+异步均可触发） */
  onError?: (err: string) => void;
  /** 每帧 WebGL 渲染完成后的回调（用于同步 drawImage 到 2D canvas，避免 iOS 缓冲区失效） */
  onRender?: () => void;
  /** v2 模式初始化状态变化回调（frame 从 null → 有效 或 有效 → null） */
  onInitStatusChange?: (ready: boolean) => void;
}

// ============== ARRenderer 类 ==============

export class ARRenderer {
  // Three.js 相关
  THREE: any = null;
  canvas: any = null;
  gl: any = null;
  renderer: any = null;
  scene: any = null;
  camera: any = null;
  model: any = null;
  reticle: any = null;
  mixers: any[] | null = null;
  clock: any = null;
  _insertModels: any[] = [];

  // VKSession 相关
  session: any = null;
  anchor2DList: any[] = [];

  // 渲染参数
  data: {
    width: number;
    height: number;
    fps: number;
    screenTop: number;
    screenBottom: number;
    anchor2DList: any[];
    initShadersDone: boolean;
  } = {
    width: 1,
    height: 1,
    fps: 0,
    screenTop: -1,
    screenBottom: 1,
    anchor2DList: [],
    initShadersDone: false,
  };

  // 模式
  mode: ARMode = 'default';
  config: ARConfig;
  options: ARRendererOptions;

  // YUV Shader 相关
  _program: any = null;
  _vao: any = null;
  _ext: any = null;
  _dt: any = null;

  // RGBA Shader 相关（iOS 用）
  _rgbaProgram: any = null;
  _rgbaVAO: any = null;
  _rgbaTexLoc: any = null;
  _rgbaDtLoc: any = null;
  _rgbaTexture: any = null;

  // 平台标识
  private isIOS = false;

  // 人脸检测框 Shader 相关
  vertexProgram: any = null;
  rectEdgeProgram: any = null;

  // 离屏 Canvas（用于 Three.js 渲染）
  offScreenCanvas: any = null;

  // 回调
  onTouchEndCallback: ((x: number, y: number) => void) | null = null;
  onReadyCallback: (() => void) | null = null;
  errorCallback: ((err: string) => void) | null = null;
  onRenderCallback: (() => void) | null = null;
  onInitStatusCallback: ((ready: boolean) => void) | null = null;

  // 渲染循环标志
  private disposed = false;

  // v2 初始化状态跟踪
  private v2InitReady = false; // frame 是否曾经变为有效（初始化完成）

  // VKSession 错误信息（环境不支持时设置）
  vkError: string | null = null;

  // default 模式：每帧 hitTest(0.5,0.5) 的最新命中结果（持续 hitTest 保持平面检测活跃）
  private lastHitTransform: Float32Array | number[] | null = null;

  constructor(options: ARRendererOptions) {
    this.options = options;
    this.mode = options.mode;
    this.config = options.config;
    this.data.width = options.width;
    this.data.height = options.height;
    this.data.screenTop = options.screenTop ?? -1;
    this.data.screenBottom = options.screenBottom ?? 1;
    this.onTouchEndCallback = options.onTouchEnd ?? null;
    this.onReadyCallback = options.onReady ?? null;
    this.errorCallback = options.onError ?? null;
    this.onRenderCallback = options.onRender ?? null;
    this.onInitStatusCallback = options.onInitStatusChange ?? null;
  }

  setData(args: Record<string, any>) {
    for (const k in args) {
      (this.data as any)[k] = args[k];
    }
  }

  /**
   * 初始化 AR 渲染器
   * 创建离屏 WebGL Canvas → Three.js 场景 → VKSession
   */
  /**
   * 初始化 AR 渲染器
   * 创建离屏 WebGL Canvas → Three.js 场景 → VKSession
   *
   * 对齐旧版 behavior.js 架构：
   *   - offScreenCanvas: wx.createCanvas() + getContext("webgl") → 给 Three.js 用
   *   - 主 canvas (app.view) 的 2D context: 用于 drawImage 合成（由外部 aiAr.ts 处理）
   */
  init() {
    try {
      this.isIOS = (wx as any).getSystemInfoSync().platform === 'ios';

      // 创建独立的离屏 WebGL Canvas（与 PIXI 的 canvas 隔离）
      this.offScreenCanvas = (wx as any).createCanvas();
      this.offScreenCanvas.width = this.data.width;
      this.offScreenCanvas.height = this.data.height;

      // iOS 上 drawImage 从 WebGL canvas 拷贝到 2D canvas 需 preserveDrawingBuffer，Android 不需要
      const isIOS = (wx as any).getSystemInfoSync().platform === 'ios';
      const ctxAttrs = isIOS ? { preserveDrawingBuffer: true } : undefined;
      const webglCtx = this.offScreenCanvas.getContext('webgl', ctxAttrs)
        || this.offScreenCanvas.getContext('experimental-webgl', ctxAttrs);
      if (!webglCtx) {
        throw new Error('无法获取 WebGL context，设备可能不支持 WebGL');
      }
      this.canvas = this.offScreenCanvas;
      this.gl = webglCtx;

      // 初始化 Three.js
      this.initTHREE();

      // 初始化 GLSL（YUV + 人脸检测框）
      this.initGL();

      // 初始化 VKSession
      this.initVK(this.config);

      // 请求相机权限
      (wx as any).authorize({
        scope: 'scope.camera',
        success: (res: any) => console.log('相机授权成功:', res),
        fail: (err: any) => console.error('相机授权失败:', err),
      });
    } catch (e) {
      console.error('[AR] init 异常:', e);
      throw e;
    }
  }

  private initTHREE() {
    const { createScopedThreejs } = require('../../vendor/threejs-miniprogram/index');

    const THREE = (this.THREE = createScopedThreejs(this.canvas));
    registerGLTFLoader(THREE);

    // 相机
    this.camera = new THREE.Camera();

    // 场景
    const scene = (this.scene = new THREE.Scene());

    // 光源
    const light1 = new THREE.HemisphereLight(0xffffff, 0x444444);
    light1.position.set(0, 0.2, 0);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff);
    light2.position.set(0, 0.2, 0.1);
    scene.add(light2);

    // 渲染层（使用离屏 Canvas，WebGL context 已在 init() 中获取）
    const isIOS = (wx as any).getSystemInfoSync().platform === 'ios';
    const renderer = (this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: this.offScreenCanvas,
      preserveDrawingBuffer: isIOS,
    }));
    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    if (!this.gl) {
      this.gl = renderer.getContext();
    }
    this.gl.disable(this.gl.CULL_FACE);

    this.clock = new THREE.Clock();
  }

  private initVK(config: ARConfig) {
    // 检查 VKSession API 是否存在
    if (typeof (wx as any).createVKSession !== 'function') {
      const msg = '当前环境不支持 createVKSession，请在真机上运行';
      console.warn('[AR] ' + msg);
      this.vkError = msg;
      if (this.errorCallback) this.errorCallback(msg);
      return;
    }

    config.gl = this.gl;
    let session: any;
    try {
      session = this.session = (wx as any).createVKSession(config);
    } catch (e: any) {
      const msg = '创建 VKSession 失败: ' + (e?.errMsg || e?.message || String(e));
      console.error('[AR] ' + msg);
      this.vkError = msg;
      if (this.errorCallback) this.errorCallback(msg);
      return;
    }

    session.start((err: any) => {
      if (err) {
        const msg = 'VKSession 启动失败（可能设备不支持此版本）: ' + err;
        console.error('[AR] ' + msg);
        this.vkError = msg;
        if (this.errorCallback) this.errorCallback(msg);
        return;
      }
      console.log('[AR] VKSession.version', session.version);
      if (this.onReadyCallback) this.onReadyCallback();

      // 加载机器人模型
      const loader = new this.THREE.GLTFLoader();
      loader.load(
        'https://dldir1.qq.com/weixin/miniprogram/RobotExpressive_aa2603d917384b68bb4a086f32dabe83.glb',
        (gltf: any) => {
          this.model = {
            scene: gltf.scene,
            animations: gltf.animations,
          };
        }
      );

      // planeAR 模式加载 reticle 光标
      if (this.mode === 'planeAR') {
        loader.load(
          'https://dldir1.qq.com/weixin/miniprogram/reticle_4b6cc19698ca4a08b31fd3c95ce412ec.glb',
          (gltf: any) => {
            const reticle = (this.reticle = gltf.scene);
            reticle.visible = false;
            this.scene.add(reticle);
          }
        );
      }

      // faceDetect 模式监听人脸锚点
      if (this.mode === 'faceDetect') {
        session.on('addAnchors', (anchors: any[]) => {
          this.data.anchor2DList = anchors.map((anchor) => ({
            points: anchor.points,
            origin: anchor.origin,
            size: anchor.size,
          }));
        });
        session.on('updateAnchors', (anchors: any[]) => {
          this.data.anchor2DList = [];
          this.data.anchor2DList = this.data.anchor2DList.concat(
            anchors.map((anchor) => ({
              points: anchor.points,
              origin: anchor.origin,
              size: anchor.size,
            }))
          );
        });
        session.on('removeAnchors', () => {
          this.data.anchor2DList = [];
        });
      }

      // 逐帧渲染
      let frameCount = 0;
      const isV2 = this.config.version === 'v2';
      const onFrame = (_timestamp: number) => {
        if (this.disposed) return;
        const fw = Math.round(this.data.width);
        const fh = Math.round(this.data.height);
        let frame: any = null;
        try {
          frame = this.session.getVKFrame(fw, fh);
        } catch (_e) {
          /* noop */
        }
        frameCount++;

        // v2 初始化状态检测
        if (isV2) {
          if (frame && !this.v2InitReady) {
            this.v2InitReady = true;
            if (this.onInitStatusCallback) this.onInitStatusCallback(true);
          } else if (!frame && !this.v2InitReady && frameCount === 15) {
            if (this.onInitStatusCallback) this.onInitStatusCallback(false);
          }
        }

        if (frame) {
          this.renderFrame(frame);
        }
        this.session.requestAnimationFrame(onFrame);
      };
      this.session.requestAnimationFrame(onFrame);
    });
  }

  // ============== YUV 相机背景渲染 ==============

  private initShader() {
    const gl = this.gl;
    const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);

    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, YUV_VS);
    gl.compileShader(vertShader);

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, YUV_FS);
    gl.compileShader(fragShader);

    const program = (this._program = gl.createProgram());
    this._program.gl = gl;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.deleteShader(vertShader);
    gl.deleteShader(fragShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const uniformYTexture = gl.getUniformLocation(program, 'y_texture');
    gl.uniform1i(uniformYTexture, 5);
    const uniformUVTexture = gl.getUniformLocation(program, 'uv_texture');
    gl.uniform1i(uniformUVTexture, 6);

    this._dt = gl.getUniformLocation(program, 'displayTransform');

    // iOS：额外创建 RGBA shader
    if (this.isIOS) {
      const rgbaFrag = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(rgbaFrag, RGBA_FS);
      gl.compileShader(rgbaFrag);

      const rgbaVert = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(rgbaVert, YUV_VS); // 顶点着色器共用
      gl.compileShader(rgbaVert);

      const rgbaProgram = (this._rgbaProgram = gl.createProgram());
      gl.attachShader(rgbaProgram, rgbaVert);
      gl.attachShader(rgbaProgram, rgbaFrag);
      gl.deleteShader(rgbaVert);
      gl.deleteShader(rgbaFrag);
      gl.linkProgram(rgbaProgram);
      gl.useProgram(rgbaProgram);

      this._rgbaTexLoc = gl.getUniformLocation(rgbaProgram, 'rgba_texture');
      gl.uniform1i(this._rgbaTexLoc, 5);
      this._rgbaDtLoc = gl.getUniformLocation(rgbaProgram, 'displayTransform');
    }

    gl.useProgram(currentProgram);
  }

  private initVAO() {
    const gl = this.gl;
    const ext = gl.getExtension('OES_vertex_array_object');
    this._ext = ext;

    // 创建 YUV VAO（Android 用）
    this._vao = this.createVAOForProgram(ext, this._program);

    // iOS：创建 RGBA VAO（翻转 V 分量修正上下颠倒）
    if (this.isIOS && this._rgbaProgram) {
      this._rgbaVAO = this.createVAOForProgram(ext, this._rgbaProgram, true);
    }
  }

  private createVAOForProgram(ext: any, program: any, flipY = false) {
    const gl = this.gl;
    const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
    const vao = ext.createVertexArrayOES();
    ext.bindVertexArrayOES(vao);

    const posAttr = gl.getAttribLocation(program, 'a_position');
    const pos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pos);

    const y1 = this.data.screenTop;
    const y2 = this.data.screenBottom;
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([y2, 1, y1, 1, y2, -1, y1, -1]),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttr);
    vao.posBuffer = pos;

    const texcoordAttr = gl.getAttribLocation(program, 'a_texCoord');
    const texcoord = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoord);
    // iOS: getCameraBuffer 返回的 buffer 上下方向与 WebGL 纹理坐标相反，需翻转 V 分量
    const texCoords = flipY
      ? new Float32Array([1, 0, 0, 0, 1, 1, 0, 1])
      : new Float32Array([1, 1, 0, 1, 1, 0, 0, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);
    gl.vertexAttribPointer(texcoordAttr, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(texcoordAttr);
    vao.texcoordBuffer = texcoord;

    ext.bindVertexArrayOES(currentVAO);
    return vao;
  }

  private initGL() {
    this.initShader();
    this.initVAO();
  }

  private renderGL(frame: any) {
    const gl = this.gl;
    gl.disable(gl.DEPTH_TEST);

    if (this.isIOS) {
      // iOS: 尝试 YUV 纹理路径（polyfill createYUVTexture 后）
      // 如果 yTexture/uvTexture 有效，走 YUV 渲染；否则 fallback 到 getCameraBuffer
      let yTexture: any = null;
      let uvTexture: any = null;
      let displayTransform: any = null;
      try {
        const camTex = frame.getCameraTexture(gl, 'yuv');
        yTexture = camTex.yTexture;
        uvTexture = camTex.uvTexture;
        displayTransform = frame.getDisplayTransform();
      } catch (_e) {
        // iOS 不支持 createYUVTexture，fallback 到 getCameraBuffer
      }

      if (yTexture && uvTexture) {
        // YUV 纹理路径（和 Android 一致）
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);

        gl.useProgram(this._program);
        this._ext.bindVertexArrayOES(this._vao);

        gl.uniformMatrix3fv(this._dt, false, displayTransform);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        gl.activeTexture(gl.TEXTURE0 + 5);
        const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D);
        gl.bindTexture(gl.TEXTURE_2D, yTexture);

        gl.activeTexture(gl.TEXTURE0 + 6);
        const bindingTexture6 = gl.getParameter(gl.TEXTURE_BINDING_2D);
        gl.bindTexture(gl.TEXTURE_2D, uvTexture);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindTexture(gl.TEXTURE_2D, bindingTexture6);
        gl.activeTexture(gl.TEXTURE0 + 5);
        gl.bindTexture(gl.TEXTURE_2D, bindingTexture5);

        gl.useProgram(currentProgram);
        gl.activeTexture(currentActiveTexture);
        this._ext.bindVertexArrayOES(currentVAO);
      } else {
        // Fallback: getCameraBuffer RGBA 路径（v1 场景）
        const bufW = Math.ceil(this.data.width / 16) * 16;
        const bufH = Math.round(this.data.height);
        const camBuffer = frame.getCameraBuffer(bufW, bufH);
        if (camBuffer && camBuffer.byteLength > 0) {
          const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
          const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
          const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);

          if (!this._rgbaTexture) {
            this._rgbaTexture = gl.createTexture();
          }
          gl.activeTexture(gl.TEXTURE0 + 5);
          const bindingTexture = gl.getParameter(gl.TEXTURE_BINDING_2D);
          gl.bindTexture(gl.TEXTURE_2D, this._rgbaTexture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, bufW, bufH, 0, gl.RGBA, gl.UNSIGNED_BYTE, camBuffer);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

          gl.useProgram(this._rgbaProgram);
          this._ext.bindVertexArrayOES(this._rgbaVAO);
          gl.uniformMatrix3fv(this._rgbaDtLoc, false, IDENTITY_MAT3);
          gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          gl.bindTexture(gl.TEXTURE_2D, bindingTexture);
          gl.useProgram(currentProgram);
          gl.activeTexture(currentActiveTexture);
          this._ext.bindVertexArrayOES(currentVAO);
        }
      }
    } else {
      // Android：YUV 模式
      const { yTexture, uvTexture } = frame.getCameraTexture(gl, 'yuv');
      const displayTransform = frame.getDisplayTransform();
      if (yTexture && uvTexture) {
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        const currentActiveTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        const currentVAO = gl.getParameter(gl.VERTEX_ARRAY_BINDING);

        gl.useProgram(this._program);
        this._ext.bindVertexArrayOES(this._vao);

        gl.uniformMatrix3fv(this._dt, false, displayTransform);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        gl.activeTexture(gl.TEXTURE0 + 5);
        const bindingTexture5 = gl.getParameter(gl.TEXTURE_BINDING_2D);
        gl.bindTexture(gl.TEXTURE_2D, yTexture);

        gl.activeTexture(gl.TEXTURE0 + 6);
        const bindingTexture6 = gl.getParameter(gl.TEXTURE_BINDING_2D);
        gl.bindTexture(gl.TEXTURE_2D, uvTexture);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindTexture(gl.TEXTURE_2D, bindingTexture6);
        gl.activeTexture(gl.TEXTURE0 + 5);
        gl.bindTexture(gl.TEXTURE_2D, bindingTexture5);

        gl.useProgram(currentProgram);
        gl.activeTexture(currentActiveTexture);
        this._ext.bindVertexArrayOES(currentVAO);
      }
    }
  }

  // ============== 人脸检测框渲染 ==============

  private loadShader(gl: any, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
      console.log('编译着色器失败: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private initShaders(gl: any, vsSource: string, fsSource: string) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertexShader || !fragmentShader) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      console.log('程序对象连接失败: ' + gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    this.setData({ initShadersDone: true });
    return program;
  }

  private initVertexBuffers(gl: any, anchor2DList: any[]) {
    const flattenPoints: number[] = [];
    anchor2DList.forEach((anchor) => {
      anchor.points.forEach((point: any) => {
        const { x, y } = point;
        flattenPoints.push(x * 2 - 1, 1 - y * 2);
      });
    });
    const vertices = new Float32Array(flattenPoints);
    const n = flattenPoints.length / 2;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return n;
  }

  private initRectEdgeBuffer(
    gl: any,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const shaderProgram = gl.program;
    const centerX = x * 2 - 1 + width;
    const centerY = -1 * (y * 2 - 1) - height;
    const right = width;
    const top = height;
    const vertices = [-1, 1, -1, -1, 1, 1, 1, -1];
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(shaderProgram, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    const rightTopLoc = gl.getUniformLocation(shaderProgram, 'rightTopPoint');
    gl.uniform2fv(rightTopLoc, [right, top]);
    const centerPointLoc = gl.getUniformLocation(
      shaderProgram,
      'centerPoint'
    );
    gl.uniform2fv(centerPointLoc, [centerX, centerY]);
    return vertices.length / 2;
  }

  private onDrawRectEdge(
    gl: any,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    width = Math.round(width * 100) / 100;
    height = Math.round(height * 100) / 100;
    const n = this.initRectEdgeBuffer(gl, x, y, width, height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }

  // ============== Reticle 光标 ==============

  private renderReticle() {
    const reticle = this.reticle;
    if (reticle) {
      const hitTestRes = this.session.hitTest(0.5, 0.5);
      if (hitTestRes.length) {
        reticle.matrixAutoUpdate = false;
        reticle.matrix.fromArray(hitTestRes[0].transform);
        reticle.matrix.decompose(
          reticle.position,
          reticle.quaternion,
          reticle.scale
        );
        reticle.visible = true;
      } else {
        reticle.visible = false;
      }
    }
  }

  // ============== 动画更新 ==============

  private updateAnimation() {
    const dt = this.clock.getDelta();
    if (this.mixers) this.mixers.forEach((mixer) => mixer.update(dt));
  }

  // ============== 模型克隆 ==============

  private copyRobot() {
    const THREE = this.THREE;
    const { scene, animations } = cloneGltf(this.model, THREE);
    scene.scale.set(0.05, 0.05, 0.05);

    const mixer = new THREE.AnimationMixer(scene);
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i];
      if (clip.name === 'Dance') {
        const action = mixer.clipAction(clip);
        action.play();
      }
    }

    this.mixers = this.mixers || [];
    this.mixers.push(mixer);
    scene._mixer = mixer;
    return scene;
  }

  private getRobot() {
    const THREE = this.THREE;
    const model = new THREE.Object3D();
    model.add(this.copyRobot());

    this._insertModels = this._insertModels || [];
    this._insertModels.push(model);

    // 限制最多 5 个模型
    if (this._insertModels.length > 5) {
      const needRemove = this._insertModels.splice(
        0,
        this._insertModels.length - 5
      );
      needRemove.forEach((item: any) => {
        if (item._mixer) {
          const mixer = item._mixer;
          this.mixers!.splice(this.mixers!.indexOf(mixer), 1);
          mixer.uncacheRoot(mixer.getRoot());
        }
        if (item.parent) item.parent.remove(item);
      });
    }
    return model;
  }

  // ============== 触摸交互 ==============

  onTouchEnd(x: number, y: number) {
    if (this.mode === 'faceDetect') {
      return;
    } else if (this.mode === 'planeAR') {
      if (this.scene && this.model && this.reticle) {
        const model = this.getRobot();
        model.position.copy(this.reticle.position);
        model.rotation.copy(this.reticle.rotation);
        this.scene.add(model);
      }
      } else {
      // default 模式：hitTest 点击位置放置机器人
      if (this.session && this.scene && this.model) {
        const hitTestRes = this.session.hitTest(
          x / this.data.width,
          y / this.data.height,
          this.resetPanel
        );
        this.resetPanel = false;
        if (hitTestRes.length) {
          const model = this.getRobot();
          model.matrixAutoUpdate = false;
          model.matrix.fromArray(hitTestRes[0].transform);
          this.scene.add(model);
        } else if (this.lastHitTransform) {
          // 点击位置未命中，fallback 到屏幕中心持续 hitTest 的结果
          const model = this.getRobot();
          model.matrixAutoUpdate = false;
          model.matrix.fromArray(this.lastHitTransform);
          this.scene.add(model);
        } else {
          wx.showToast({ title: '未检测到平面,请对准地面后重试', icon: 'none', duration: 1500 });
        }
      } else if (!this.model) {
        wx.showToast({ title: '模型加载中,请稍后重试', icon: 'none', duration: 1500 });
      }
    }
  }

  private resetPanel = false;

  // ============== 主渲染循环 ==============

  private renderFrame(frame: any) {
    const NEAR = 0.001;
    const FAR = 1000;

    // 1. 渲染相机背景
    this.renderGL(frame);

    // 2. planeAR 模式更新 reticle 光标
    if (this.mode === 'planeAR') {
      this.renderReticle();
    }

    // 2b. default 模式：持续 hitTest 屏幕中心，保持平面检测活跃（不显示 reticle 光标）
    if (this.mode === 'default' && this.session) {
      const hitTestRes = this.session.hitTest(0.5, 0.5);
      if (hitTestRes.length) {
        this.lastHitTransform = hitTestRes[0].transform;
      }
    }

    // 3. 更新动画
    this.updateAnimation();

    // 4. 更新相机矩阵
    const camera = frame.camera;
    if (camera) {
      this.camera.matrixAutoUpdate = false;
      this.camera.matrixWorldInverse.fromArray(camera.viewMatrix);
      this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse);
      const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR);
      this.camera.projectionMatrix.fromArray(projectionMatrix);
      this.camera.projectionMatrixInverse.getInverse(
        this.camera.projectionMatrix
      );
    }

    // 5. Three.js 3D 渲染（不清除颜色缓冲，保留相机背景）
    this.renderer.autoClearColor = false;
    this.renderer.render(this.scene, this.camera);
    this.renderer.state.setCullFace(this.THREE.CullFaceNone);
    this.renderer.state.reset();

    // 6. faceDetect 模式渲染人脸检测框
    if (this.mode === 'faceDetect') {
      const gl = this.gl;
      const anchor2DList = this.data.anchor2DList;
      if (anchor2DList && anchor2DList.length > 0) {
        if (!this.data.initShadersDone) {
          this.vertexProgram = this.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
          this.rectEdgeProgram = this.initShaders(
            gl,
            EDGE_VSHADER_SOURCE,
            EDGE_FSHADER_SOURCE
          );
          if (!this.vertexProgram || !this.rectEdgeProgram) {
            console.log('初始化着色器失败');
            return;
          }
          console.log('初始化着色器成功');
        }

        // 绘制绿色关键点
        gl.useProgram(this.vertexProgram);
        gl.program = this.vertexProgram;
        const n = this.initVertexBuffers(gl, anchor2DList);
        gl.drawArrays(gl.POINTS, 0, n);

        // 绘制红色边框
        gl.useProgram(this.rectEdgeProgram);
        gl.program = this.rectEdgeProgram;
        for (let i = 0; i < anchor2DList.length; i++) {
          this.onDrawRectEdge(
            gl,
            anchor2DList[i].origin.x,
            anchor2DList[i].origin.y,
            anchor2DList[i].size.width,
            anchor2DList[i].size.height
          );
        }
      }
    }

    // 同步通知外部：WebGL 渲染已完成，可立即 drawImage（iOS 上缓冲区不会失效）
    if (this.onRenderCallback) {
      this.onRenderCallback();
    }
  }

  switchCamera() {
    if (this.config.cameraPosition === 0) {
      this.config.cameraPosition = 1;
    } else {
      this.config.cameraPosition = 0;
    }
    if (this.session) {
      this.session.config = this.config;
    }
  }

  // ============== 获取渲染 Canvas ==============

  getCanvas() {
    return this.offScreenCanvas;
  }

  // ============== 资源销毁 ==============

  dispose() {
    this.disposed = true;

    if (this.session) {
      try {
        this.session.stop();
        this.session.destroy();
      } catch (_e) {
        /* noop */
      }
      this.session = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    if (this.scene) {
      this.scene.dispose();
      this.scene = null;
    }
    this.camera = null;
    this.model = null;
    this.reticle = null;
    this._insertModels = [];
    if (this.mixers) {
      this.mixers.forEach((mixer) => mixer.uncacheRoot(mixer.getRoot()));
      this.mixers = null;
    }
    this.clock = null;
    this.THREE = null;
    this.canvas = null;
    if (this._rgbaTexture && this.gl) {
      this.gl.deleteTexture(this._rgbaTexture);
      this._rgbaTexture = null;
    }
    this.gl = null;
    this.anchor2DList = [];
  }
}
