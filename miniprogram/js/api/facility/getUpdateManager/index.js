import view from './view';
import * as show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    let gameIcon;
    return view(PIXI, app, obj, data => {
        let { status } = data,
            updateManager;
        switch (status) {
            case 'getUpdateManager':
                // 获取全局唯一的版本更新管理器，用于管理小程序更新。
                updateManager = wx.getUpdateManager();

                updateManager.onCheckForUpdate(res => {
                    // 请求完新版本信息的回调
                    !res.hasUpdate &&  show.Modal('已是最新版，无需更新！', '提示');
                });

                updateManager.onUpdateReady(() => {
                    show.Modal('新版本已经准备好，重启应用!', '更新提示', () => {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate();
                    });
                });

                updateManager.onUpdateFailed(() => {
                    // 新版本下载失败
                    show.Modal('新版本下载失败（可能是网络原因等）！', '提示');
                });
        }
    });
};
