import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, data => {
        let { status, index } = data;
        switch (status) {
            case 'saveFile':
                wx.showLoading({ title: '生成临时文件中', mask: true });
                // 调用downloadFile把网络资源生成临时路径
                wx.downloadFile({
                    url: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20190813/advideo.MP4',
                    success(res) {
                        wx.hideLoading();
                        let pathArr = [`${wx.env.USER_DATA_PATH}/fileA`, '无路径'];

                        // 当filePath为空时就会保存为本地缓存文件
                        let filePath = pathArr[index] !== '无路径' ? `${pathArr[index]}/video.mp4` : '';

                        // 先获取全局唯一的文件管理器，接着调起saveFile方法
                        wx.getFileSystemManager().saveFile({
                            tempFilePath: res.tempFilePath,
                            filePath,
                            recursive: true,
                            success() {
                                show.Toast('保存成功', 'success', 800);
                            },
                            fail(res) {
                                if (!res.errMsg) return;

                                if (res.errMsg.includes('fail exceeded the maximum size of the file storage limit 50M'))
                                    return show.Modal('超过文件存储限制的最大大小50M', '发生错误');

                                if (res.errMsg.includes('fail no such file or directory')) {
                                    res.errMsg = `上级目录 ${JSON.stringify(pathArr[index])} 不存在，请去创建目录`;

                                    show.Modal(res.errMsg, '发生错误');
                                }
                            }
                        });
                    },
                    fail: () => {
                        wx.hideLoading();
                    }
                });

                break;
        }
    });
};
