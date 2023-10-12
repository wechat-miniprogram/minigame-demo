import getBehavior from './behavior'
import yuvBehavior from './yuvBehavior'
import {detectBoxBehavior, VSHADER_SOURCE, FSHADER_SOURCE, EDGE_VSHADER_SOURCE, EDGE_FSHADER_SOURCE} from './detectBoxBehavior'

function parseComponent(component){
  var key = ["lifetimes", "methods"];
  return Object.assign({data :component["data"]}, ...key.reduce((ret,k) => {
    ret.push(component[k]);
    return ret;
  },[]));
}

module.exports = parseComponent({
    behaviors: [getBehavior(), yuvBehavior, detectBoxBehavior],
    data: {
      theme: 'light',
      ...getBehavior().data,
      ...yuvBehavior.data,
      ...detectBoxBehavior.data
    },
    lifetimes: {
    },
    methods: {
      ...getBehavior().methods,
      ...yuvBehavior.methods,
      ...detectBoxBehavior.methods,
        init() {
            this.initGL()
        },
        render(frame) {
            const camera = frame.camera
            this.updateAnimation()

            // 相机
            if (camera) {
                this.camera.matrixAutoUpdate = false
                this.camera.matrixWorldInverse.fromArray(camera.viewMatrix)
                this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

                const projectionMatrix = camera.getProjectionMatrix(0.001, 1000)
                this.camera.projectionMatrix.fromArray(projectionMatrix)
                this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
            }

            this.renderer.autoClearColor = false
            this.renderer.render(this.scene, this.camera)
            this.renderer.state.setCullFace(this.THREE.CullFaceNone)
            this.renderer.state.reset();

            if(this.mode == 'faceDetect'){
                let gl = this.gl
                const anchor2DList = this.data.anchor2DList
                if (!anchor2DList || anchor2DList.length <= 0) {
                    return
                  } else {
                    if (!this.data.initShadersDone) {
                      this.vertexProgram = this.initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
                      this.rectEdgeProgram =this.initShaders(gl, EDGE_VSHADER_SOURCE, EDGE_FSHADER_SOURCE)
                      if (!this.vertexProgram || !this.rectEdgeProgram) {
                        console.log('初始化着色器失败')
                        return
                      }
                      console.log('初始化着色器成功')
                    }

            
                    gl.useProgram(this.vertexProgram)
                    gl.program = this.vertexProgram
                    //初始化顶点坐标和顶点颜色
                    var n = this.initVertexBuffers(gl, anchor2DList)
            
                    //绘制点
                    gl.drawArrays(gl.POINTS, 0, n)
            
                    gl.useProgram(this.rectEdgeProgram)
                    gl.program = this.rectEdgeProgram
            
                    for (var i = 0; i < anchor2DList.length; i++) {
                      this.onDrawRectEdge(gl, anchor2DList[i].origin.x, anchor2DList[i].origin.y, anchor2DList[i].size.width, anchor2DList[i].size.height)
                    }
                  }
            }

      
        },
    },
});