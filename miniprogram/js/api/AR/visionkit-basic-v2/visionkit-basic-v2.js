import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'

const NEAR = 0.001
const FAR = 1000

function parseComponent(component){
  var key = ["lifetimes", "methods"];
  return Object.assign({data :component["data"]}, ...key.reduce((ret,k) => {
    ret.push(component[k]);
    return ret;
  },[]));
}

module.exports = parseComponent({
    behaviors: [getBehavior(), yuvBehavior],
    data: {
      theme: 'light',
      ...getBehavior().data,
      ...yuvBehavior.data,
    },
    lifetimes: {
        /**
        * 生命周期函数--监听页面加载
        */
        detached() {
        console.log("页面detached")
        if (wx.offThemeChange) {
          wx.offThemeChange()
        }
        },
        ready() {
        console.log("页面准备完全")
          this.setData({
            theme: wx.getSystemInfoSync().theme || 'light'
          })
  
          if (wx.onThemeChange) {
            wx.onThemeChange(({theme}) => {
              this.setData({theme})
            })
          }
        },
    },
    methods: {
      ...getBehavior().methods,
      ...yuvBehavior.methods,
        init() {
            this.initGL()
        },
        render(frame) {
            this.renderGL(frame)

            const camera = frame.camera

            const dt = this.clock.getDelta()
            if (this.mixers) {
                this.mixers.forEach(mixer => mixer.update(dt))
            }

            // 相机
            if (camera) {
                this.camera.matrixAutoUpdate = false
                this.camera.matrixWorldInverse.fromArray(camera.viewMatrix)
                this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

                const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR)
                this.camera.projectionMatrix.fromArray(projectionMatrix)
                this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
            }

            this.renderer.autoClearColor = false
            this.renderer.render(this.scene, this.camera)
            this.renderer.state.setCullFace(this.THREE.CullFaceNone)
            this.renderer.state.reset();
        },
    },
});