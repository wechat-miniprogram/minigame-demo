module.exports = {
    request(callback) {
        wx.request({
            url: 'https://developers.weixin.qq.com/minigame/dev/api/base/system/system-info/wx.getSystemInfoSync.html',
            success(res) {
                wx.showToast({
                    title: '请求成功',
                    icon: 'success',
                    duration: 1000
                });
                callback && callback(res);
            },
            fail() {
                wx.showToast({
                    title: '请求失败',
                    icon: 'success',
                    duration: 1000
                });
            }
        });
    },
    downloadFile(callback) {
        wx.downloadFile({
            url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190812/game.png',
            success(res) {
                wx.showToast({
                    title: '下载成功',
                    icon: 'success',
                    duration: 1000
                });
                callback && callback(res);
            },
            fail() {
                wx.showToast({
                    title: '下载失败',
                    icon: 'success',
                    duration: 1000
                });
            }
        });
    },
    uploadFile(imageSrc, callback) {
        wx.showLoading({
            title: '上传中...',
            mask: true
        });
        wx.uploadFile({
            url: 'https://developers.weixin.qq.com/minigame/dev/api/render/image/wx.createImage.html',
            filePath: imageSrc,
            name: 'data',
            success(res) {
                wx.hideLoading();
                console.log('uploadImage success, res is:', res);
                wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                    duration: 1000
                });
                callback && callback(true);
            },
            fail({ errMsg }) {
                wx.hideLoading();
                console.log('uploadImage fail, errMsg is', errMsg);
                wx.showToast({
                    title: '上传失败',
                    icon: 'success',
                    duration: 1000
                });
                callback && callback(false);
            }
        });
    }
};
