import view from './view';
module.exports = function (PIXI, app, obj) {
    const gameServer = wx.getGameServerManager(),
        matchId = {
            '1v1': 'npvL4nYFZCEJuKT6jQwiWGO2FKMB6gIYN9svnB6C8PI',
            '3v3': 'rgisvVgmGZz0p3C61zIUexIgDibx0DNzbNTn4QcHZEc',
        };
    let recordFunc;

    return view(PIXI, app, obj, (data) => {
        let { status, pattern, drawFn } = data;
        switch (status) {
            case 'startMatch':
                gameServer.startMatch({ match_id: matchId[pattern] }); // 开始匹配

                wx.showLoading({ title: '匹配中...' });

                drawFn(); // 更新UI

                gameServer.onMatch(
                    (recordFunc = function (res) {
                        // 匹配成功
                        wx.hideLoading();

                        drawFn(res.groupInfoList); // 更新UI

                        gameServer.offMatch(recordFunc);

                        recordFunc = null;
                    })
                );

                break;

            case 'cancelMatch':
                // 取消匹配
                if (recordFunc) wx.hideLoading(), gameServer.offMatch(recordFunc), (recordFunc = null);
                gameServer.cancelMatch({ match_id: matchId[pattern] });
                drawFn(); // 更新UI
                break;

            case 'login':
                // 登录游戏服务
                gameServer.login();
                gameServer.onLogout(gameServer.login);
                break;

            case 'logout':
                // 登出游戏服务
                if (!recordFunc) {
                    gameServer.offLogout(gameServer.login);
                    gameServer.logout();
                }
                break;
        }
    });
};
