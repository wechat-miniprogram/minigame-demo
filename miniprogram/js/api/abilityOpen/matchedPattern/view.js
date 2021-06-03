import { p_button, p_text, p_box, p_img, p_scroll } from '../../../libs/component/index';
import fixedTemplate from '../../../libs/template/fixed';
import compareVersion from '../../../libs/compareVersion';
module.exports = function (PIXI, app, obj, callBack) {
    if (compareVersion(wx.getSystemInfoSync().SDKVersion, '2.14.4') < 0) throw '基础库版本过低';

    let container = new PIXI.Container(),
        { goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
            obj,
            title: '对局匹配',
            api_name: 'startMatch',
        }),
        box = p_box(PIXI, {
            height: 372 * PIXI.ratio,
            y: underline.height + underline.y + 24 * PIXI.ratio,
        }),
        peopleCounting = p_text(PIXI, {
            content: '当前已成功匹配到的总人数：0',
            fontSize: 26 * PIXI.ratio,
            fill: 0x9f9f9f,
            x: 30 * PIXI.ratio,
            y: box.height + box.y + 38 * PIXI.ratio,
            relative_middle: { point: obj.width / 2 },
        }),
        scroll = p_scroll(PIXI, {
            width: box.width,
            height: box.height,
        }),
        solo = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: peopleCounting.height + peopleCounting.y + 38 * PIXI.ratio,
        }),
        multiUser = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: solo.height + solo.y + 20 * PIXI.ratio,
        }),
        cancelMatch = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: logoName.y - 150 * PIXI.ratio,
        });

    let matchList = [],
        pattern;
    function generateList(groupInfoList) {
        for (let i = 0; i < groupInfoList.length; i++) {
            let info = groupInfoList[i].memberInfoList[0];
            matchList[i] = p_box(PIXI, {
                height: 100 * PIXI.ratio,
                border: {
                    width: PIXI.ratio | 0,
                    color: 0xe5e5e5,
                },
                y: i && matchList[i - 1].height + matchList[i - 1].y - (PIXI.ratio | 0),
            });
            matchList[i].addChild(
                p_text(PIXI, {
                    content: `${i + 1}`,
                    fontSize: 46 * PIXI.ratio,
                    x: 30 * PIXI.ratio,
                    relative_middle: { containerHeight: matchList[i].height },
                }),
                p_img(PIXI, {
                    width: 75 * PIXI.ratio,
                    x: 100 * PIXI.ratio,
                    src: info.avatarUrl,
                    relative_middle: { containerHeight: matchList[i].height },
                }),
                p_text(PIXI, {
                    content: info.nickName,
                    fontSize: 42 * PIXI.ratio,
                    x: 225 * PIXI.ratio,
                    relative_middle: { containerHeight: matchList[i].height },
                })
            );
        }
        peopleCounting.turnText(`当前已成功匹配到的总人数：${matchList.length}`);
        return matchList;
    }

    function destroyList() {
        if (!matchList.length) return;
        scroll.myRemoveChildrenFn(0, matchList.length);
        for (let i = 0; i < matchList.length; i++) matchList[i].destroy(true);
        matchList = [];
        peopleCounting.turnText(`当前已成功匹配到的总人数：${matchList.length}`);
    }

    box.addChild(scroll);

    // 点击匹配 (1 V 1) start
    solo.myAddChildFn(
        p_text(PIXI, {
            content: `点击匹配 (1 V 1)`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: solo.width, containerHeight: solo.height },
        })
    );
    solo.onClickFn(() => {

        destroyList();

        callBack({
            status: 'startMatch',
            pattern: (pattern = '1v1'),
            drawFn(groupInfoList) {
                if (groupInfoList) {
                    scroll.myAddChildFn(...generateList(groupInfoList));
                    btnReversalDisplay();
                    return;
                }
                solo.hideFn();
                multiUser.hideFn();
                cancelMatch.showFn();
            },
        });
    });
    // 点击匹配 (1 V 1) end

    // 点击匹配 (3 V 3) start
    multiUser.myAddChildFn(
        p_text(PIXI, {
            content: `点击匹配 (3 V 3)`,
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: { containerWidth: multiUser.width, containerHeight: multiUser.height },
        })
    );
    multiUser.onClickFn(() => {

        destroyList();

        callBack({
            status: 'startMatch',
            pattern: (pattern = '3v3'),
            drawFn(groupInfoList) {
                if (groupInfoList) {
                    scroll.myAddChildFn(...generateList(groupInfoList));
                    btnReversalDisplay();
                    return;
                }
                solo.hideFn();
                multiUser.hideFn();
                cancelMatch.showFn();
            },
        });
    });
    // 点击匹配 (3 V 3) end

    // 取消匹配 start
    cancelMatch.hideFn();
    cancelMatch.myAddChildFn(
        p_text(PIXI, {
            content: '取消匹配',
            fontSize: 36 * PIXI.ratio,
            fill: 0x53535f,
            relative_middle: {
                containerWidth: cancelMatch.width,
                containerHeight: cancelMatch.height,
            },
        })
    );
    cancelMatch.onClickFn(() => {
        callBack({
            status: 'cancelMatch',
            pattern,
            drawFn: btnReversalDisplay,
        });
    });
    // 取消匹配 end

    function btnReversalDisplay() {
        solo.showFn();
        multiUser.showFn();
        cancelMatch.hideFn();
    }

    window.router.getNowPage((page) => {
        page.reload = function () {
            logo.reloadImg({ src: 'images/logo.png' });
            callBack({ status: 'login' });
        };
    });

    goBack.callBack = callBack.bind(null, { status: 'logout' });

    callBack({ status: 'login' });

    container.addChild(goBack, title, api_name, underline, box, peopleCounting, solo, multiUser, cancelMatch, logo, logoName);
    app.stage.addChild(container);

    return container;
};
