import view from '../common/view'

module.exports = function (PIXI, app, obj, callBack) {
    let container = view(PIXI, app, obj, '实时人脸检测', '切换为前置摄像头', '提示：将摄像头对准人脸, \n检测到的人脸将会被标记出识别框和面部标记点', {
        track: {
            plane: {
                mode: 3
            },
            face: {
                mode: 1
            }
        },
        cameraPosition: 0,
        version: 'v1',
    }, 'faceDetect')
    return container;
};