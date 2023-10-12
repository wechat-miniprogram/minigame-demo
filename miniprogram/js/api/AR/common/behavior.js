import {
    createScopedThreejs
} from '../threejs-miniprogram/index'
import {
    registerGLTFLoader
} from '../loaders/gltf-loader'
import cloneGltf from '../loaders/gltf-clone'

let offScreenCanvas = null
let offScreenContext
let canvas2dContext

export default function getBehavior() {
    return {
        data: {
            width: 1,
            height: 1,
            fps: 0,
            memory: 0,
            cpu: 0,
        },
        methods: {
            setData(args) {
                for (var k in args) {
                    this.data[k] = args[k]
                }
            },
            onReady(app, config, mode) {
                this.canvas = app.view
                this.mode = mode

                this.setData({
                    width: this.canvas.width,
                    height: this.canvas.height * 0.7,
                })

                this.initVK(config)


                wx.authorize({
                    scope: 'scope.camera',
                    success: res => {
                        console.log("success:", res)
                    },
                    fail: err => {
                        console.log("error:", err)
                    },
                })
            },
            onUnload() {
                if (this.renderer) {
                    this.renderer.dispose()
                    this.renderer = null
                }
                if (this.scene) {
                    this.scene.dispose()
                    this.scene = null
                }
                if (this.camera) this.camera = null
                if (this.model) this.model = null
                if (this._insertModel) this._insertModel = null
                if (this._insertModels) this._insertModels = null
                if (this.planeBox) this.planeBox = null
                if (this.mixers) {
                    this.mixers.forEach(mixer => mixer.uncacheRoot(mixer.getRoot()))
                    this.mixers = null
                }
                if (this.clock) this.clock = null

                if (this.THREE) this.THREE = null
                if (this.canvas) this.canvas = null
                if (this.gl) this.gl = null
                if (this.session) this.session = null
                if (this.anchor2DList) this.anchor2DList = []

            },
            initVK(config) {
                // 初始化 threejs
                this.initTHREE()
                const THREE = this.THREE
                this.clock = new THREE.Clock()

                // 自定义初始化
                if (this.init) this.init()

                console.log('this.gl', this.gl)

                config.gl = this.gl
                const session = this.session = wx.createVKSession(config)

                session.start(err => {
                    if (err) return console.error('VK error: ', err)

                    console.log('@@@@@@@@ VKSession.version', session.version)

                    config.cameraPosition = 0
                    console.log("end:",this.session.config)
                    this.session.config = config
                    console.log("此时config为：",config)

                    const loader = new THREE.GLTFLoader()
                    loader.load('https://dldir1.qq.com/weixin/miniprogram/RobotExpressive_aa2603d917384b68bb4a086f32dabe83.glb', gltf => {
                        this.model = {
                            scene: gltf.scene,
                            animations: gltf.animations,
                        }
                    })

                    if (this.mode == 'planeAR') {
                        loader.load('https://dldir1.qq.com/weixin/miniprogram/reticle_4b6cc19698ca4a08b31fd3c95ce412ec.glb', gltf => {
                            const reticle = this.reticle = gltf.scene

                            reticle.visible = false
                            this.scene.add(reticle)
                        })
                    }

                    if(this.mode == 'faceDetect') {
                        session.on('addAnchors', anchors => {
                            this.data.anchor2DList = anchors.map(anchor => ({
                                points: anchor.points,
                                origin: anchor.origin,
                                size: anchor.size
                            }))
                        })
                        session.on('updateAnchors', anchors => {
                            this.data.anchor2DList = []
                            // 摄像头实时检测人脸的时候 updateAnchors 会在每帧触发，所以性能要求更高，用 gl 画
                            this.data.anchor2DList = this.data.anchor2DList.concat(anchors.map(anchor => ({
                                points: anchor.points,
                                origin: anchor.origin,
                                size: anchor.size
                            })))
                        })
                        session.on('removeAnchors', anchors => {
                            this.data.anchor2DList = []
                        })
                    }


                    // 逐帧渲染
                    const onFrame = timestamp => {
                        const frame = this.session.getVKFrame(this.data.width, this.data.height)

                        if (frame) {
                            this.renderGL(frame)
                            canvas2dContext.drawImage(offScreenCanvas, 0, 0, this.data.width, this.data.height, 0, this.data.screenTop, this.data.width, this.data.height)
                            if (this.mode == 'planeAR') {
                                this.renderReticle()
                            }
                            this.render(frame)
                        }

                        session.requestAnimationFrame(onFrame)
                    }
                    session.requestAnimationFrame(onFrame)
                })
            },
            initTHREE() {
                console.log("canvas:", this.canvas)

                const THREE = this.THREE = createScopedThreejs(this.canvas)
                registerGLTFLoader(THREE)

                // 相机
                this.camera = new THREE.Camera()

                // 场景
                const scene = this.scene = new THREE.Scene()

                // 光源
                const light1 = new THREE.HemisphereLight(0xffffff, 0x444444) // 半球光
                light1.position.set(0, 0.2, 0)
                scene.add(light1)
                const light2 = new THREE.DirectionalLight(0xffffff) // 平行光
                light2.position.set(0, 0.2, 0.1)
                scene.add(light2)

                // 渲染层
                let renderer
                canvas2dContext = this.canvas.getContext("2d")
                console.log("canvas 2d context:")
                console.log(this.canvas.getContext("2d"))

                // 离屏画布无需重复创建
                if (offScreenCanvas == null) {
                    offScreenCanvas = wx.createCanvas()
                    offScreenCanvas.width = this.data.width
                    offScreenCanvas.height = this.data.height
                    offScreenContext = offScreenCanvas.getContext("webgl")
                }

                renderer = this.renderer = new THREE.WebGLRenderer({
                    antialias: true,
                    alpha: true,
                    canvas: offScreenCanvas
                })

                renderer.gammaOutput = true
                renderer.gammaFactor = 2.2

                //混用时加上
                const gl = renderer.getContext()
                gl.disable(gl.CULL_FACE)
            },
            renderReticle() {
                // 修改光标位置
                const reticle = this.reticle
                if (reticle) {
                    const hitTestRes = this.session.hitTest(0.5, 0.5)
                    if (hitTestRes.length) {
                        reticle.matrixAutoUpdate = false
                        reticle.matrix.fromArray(hitTestRes[0].transform)
                        reticle.matrix.decompose(reticle.position, reticle.quaternion, reticle.scale)
                        reticle.visible = true
                    } else {
                        reticle.visible = false
                    }
                }
            },
            updateAnimation() {
                const dt = this.clock.getDelta()
                if (this.mixers) this.mixers.forEach(mixer => mixer.update(dt))
            },
            copyRobot() {
                const THREE = this.THREE
                const {
                    scene,
                    animations
                } = cloneGltf(this.model, THREE)
                scene.scale.set(0.05, 0.05, 0.05)

                // 动画混合器
                const mixer = new THREE.AnimationMixer(scene)
                for (let i = 0; i < animations.length; i++) {
                    const clip = animations[i]
                    if (clip.name === 'Dance') {
                        const action = mixer.clipAction(clip)
                        action.play()
                    }
                }

                this.mixers = this.mixers || []
                this.mixers.push(mixer)

                scene._mixer = mixer
                return scene
            },
            getRobot() {
                const THREE = this.THREE

                const model = new THREE.Object3D()
                model.add(this.copyRobot())

                this._insertModels = this._insertModels || []
                this._insertModels.push(model)

                if (this._insertModels.length > 5) {
                    const needRemove = this._insertModels.splice(0, this._insertModels.length - 5)
                    needRemove.forEach(item => {
                        if (item._mixer) {
                            const mixer = item._mixer
                            this.mixers.splice(this.mixers.indexOf(mixer), 1)
                            mixer.uncacheRoot(mixer.getRoot())
                        }
                        if (item.parent) item.parent.remove(item)
                    })
                }

                return model
            },
            onTouchEnd(evt) {
                if (this.mode == 'faceDetect') {
                    return
                } else if (this.mode == 'planeAR') {
                    if (this.scene && this.model && this.reticle) {
                        const model = this.getRobot()
                        model.position.copy(this.reticle.position)
                        model.rotation.copy(this.reticle.rotation)
                        this.scene.add(model)
                    }
                } else {
                    // 点击位置放一个机器人
                    const touches = [{
                        x: evt.recordX,
                        y: evt.recordY
                    }]
                    if (touches.length === 1) {
                        const touch = touches[0]
                        if (this.session && this.scene && this.model) {
                            const hitTestRes = this.session.hitTest(touch.x / this.data.width, touch.y / this.data.height, this.resetPanel)
                            this.resetPanel = false
                            if (hitTestRes.length) {
                                const model = this.getRobot()
                                model.matrixAutoUpdate = false
                                model.matrix.fromArray(hitTestRes[0].transform)
                                this.scene.add(model)
                            }
                        }
                    }
                }
            }
        }
    }
}