var AuthKey;
(function (AuthKey) {
    AuthKey["userInfo"] = "userInfo";
    AuthKey["userFuzzyLocation"] = "userFuzzyLocation";
    AuthKey["werun"] = "werun";
    AuthKey["writePhotosAlbum"] = "writePhotosAlbum";
    AuthKey["WxFriendInteraction"] = "WxFriendInteraction";
    AuthKey["gameClubData"] = "gameClubData";
})(AuthKey || (AuthKey = {}));
// 缓存判断是否已授权，只在本次运行时有效
const scope = {
    userInfo: false,
    userFuzzyLocation: false,
    werun: false,
    writePhotosAlbum: false,
    WxFriendInteraction: false,
    gameClubData: false,
};
// 展示提示文案
const scopeMsg = {
    userInfo: '需要先授权用户信息',
    userFuzzyLocation: '需要先授权模糊地理位置',
    werun: '需要先授权微信运动步数',
    writePhotosAlbum: '需要先授权保存相册',
    WxFriendInteraction: '需要先授权微信朋友关系',
    gameClubData: '需要先授权游戏圈数据',
};
// 缓存查询授权
const cachedPromiseScope = {
    userInfo: null,
    userFuzzyLocation: null,
    werun: null,
    writePhotosAlbum: null,
    WxFriendInteraction: null,
    gameClubData: null,
};
// 是否跳出过隐私授权，首次打开时会跳出隐私授权
let hasPrivacySetting = false;
// // 短时间内弹过不再弹授权
// const gapTime = 3000;
// // 上一次弹出消息的时间
// let lastPrivacyTime = 0;
// 获取信息按钮列表
const userInfoButtonList = {};
/**
 * 主动拉起授权
 */
function requirePrivacyAuthorize() {
    return new Promise((resolve, reject) => {
        if (!wx.requirePrivacyAuthorize) {
            console.log('版本太低');
            reject();
            return;
        }
        // if (Date.now() - lastPrivacyTime < gapTime) {
        //   // in gap
        //   console.log('调用太频繁');
        //   reject();
        //   return;
        // }
        // lastPrivacyTime = Date.now();
        wx.requirePrivacyAuthorize({
            success: () => {
                console.log('requirePrivacyAuthorize success');
                // 用户同意授权
                resolve('');
            },
            fail: (res) => {
                console.log('requirePrivacyAuthorize fail:', res);
                // 用户拒绝授权
                reject();
            },
        });
    });
}
/**
 * 查询是否需要隐私授权弹窗
 */
function needAuthorization() {
    return new Promise((resolve, reject) => {
        if (!wx.getPrivacySetting) {
            reject('');
        }
        wx.getPrivacySetting({
            success: (res) => {
                console.log('getPrivacySetting success:', res);
                // 用户同意授权
                if (res.needAuthorization) {
                    resolve('');
                }
                else {
                    reject();
                }
            },
            fail: (res) => {
                console.log('getPrivacySetting fail:', res);
                reject();
            },
        });
    });
}
/**
 * 弹窗提醒
 * 跳出隐私授权时则不弹toast
 */
function showToast() {
    if (!hasPrivacySetting) {
        hasPrivacySetting = true;
        wx.getPrivacySetting({
            success: (res) => {
                // console.log(res);
                if (!res.needAuthorization) {
                    wx.showToast({
                        icon: 'none',
                        title: '授权失败，请稍后再试',
                    });
                }
                else {
                    // 弹出了隐私授权弹窗
                }
            },
        });
    }
    else {
        wx.showToast({
            icon: 'none',
            title: '授权失败，请稍后再试',
        });
    }
}
/**
 * 向用户发起授权请求
 */
function authorize(key, getScope, needShowModal, resolve, reject) {
    if (key === 'userInfo') {
        console.warn('除了用户信息以外，其他的授权可以通过authorize获取');
        reject();
        return;
    }
    wx.authorize({ scope: `scope.${key}` })
        .then((res) => {
        console.log('用户已授权', res);
        // 已授权
        resolve('');
    })
        .catch((res) => {
        console.log('用户未授权', res);
        // 未授权
        if (res.errMsg.indexOf('not authorized in gap') > -1) {
            showToast();
        }
        // 如果是之前弹过授权且用户拒绝，尝试弹窗提醒用户打开
        if (res.errMsg.indexOf('auth deny') > -1 &&
            needShowModal &&
            getScope === false) {
            // 用户拒绝
            wx.showModal({
                content: scopeMsg[key],
                confirmText: '去授权',
                success: (res) => {
                    if (res.confirm) {
                        wx.openSetting({
                            success: (res) => {
                                const authKey = `scope.${key}`;
                                if (res.authSetting[authKey] === true) {
                                    // 已授权
                                    resolve('');
                                    return;
                                }
                                reject();
                            },
                            fail: reject,
                        });
                        return;
                    }
                    reject();
                },
                fail: reject,
            });
            return;
        }
        reject();
    });
}
/**
 * 查询某个scope是否已授权
 * @param {String} key
 * @param {Boolean} needShowModal
 * @param {Boolean} showPrivacy
 * @returns
 */
function getAuth(key, needShowModal = true, showPrivacy = true) {
    if (cachedPromiseScope[key]) {
        return cachedPromiseScope[key];
    }
    cachedPromiseScope[key] = new Promise((resolve, reject) => {
        wx.getSetting({
            success(res) {
                const authKey = `scope.${key}`;
                const getScope = res.authSetting[authKey];
                if (getScope === true) {
                    console.log('已授权');
                    resolve('');
                    return;
                }
                needAuthorization()
                    .then(() => {
                    console.log('需要隐私弹窗');
                    if (showPrivacy) {
                        requirePrivacyAuthorize()
                            .then(() => {
                            console.log('用户同意弹窗');
                            authorize(key, getScope, needShowModal, resolve, reject);
                        })
                            .catch(() => {
                            console.log('用户不同意弹窗');
                            reject();
                        });
                    }
                    else {
                        reject();
                    }
                })
                    .catch(() => {
                    console.log('不需要隐私弹窗');
                    authorize(key, getScope, needShowModal, resolve, reject);
                });
            },
            fail(res) {
                console.warn('getSetting fail:', res);
                reject();
            },
        });
    })
        .then(() => {
        scope[key] = true;
        return Promise.resolve('');
    })
        .catch(() => {
        scope[key] = false;
        return Promise.reject();
    })
        .finally(() => {
        cachedPromiseScope[key] = null;
    });
    return cachedPromiseScope[key];
}
/**
 * 获取是否已授权个人信息，如果没有授权则拉起授权弹窗
 * 请务必在点击事件后调用改函数
 */
function getAuthUserInfo(needShowModal = true, showPrivacy = true) {
    return getAuth(AuthKey.userInfo, needShowModal, showPrivacy);
}
/**
 * 创建获取个人信息按钮
 */
function createUserInfoButton(key, data, callback) {
    const { x, y, width, height } = data;
    // 如果已存在创建的按钮，则说明用户还没授权，直接提示
    if (userInfoButtonList[key]) {
        showUserInfoButton(key);
        return;
    }
    getAuthUserInfo(false, false)
        .then(() => {
        wx.getUserInfo({
            success: (res) => {
                callback(res);
            },
        });
    })
        .catch(() => {
        userInfoButtonList[key] = wx.createUserInfoButton({
            type: 'text',
            text: key,
            style: {
                left: x,
                top: y,
                width: width,
                height: height,
                lineHeight: height,
                textAlign: 'center',
                color: '#ffffff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                fontSize: height * 0.4,
                borderRadius: height * 0.2,
            },
        });
        // 如果你希望按钮是透明的，改backgroundColor的透明度
        // userInfoButtonList[key] = wx.createUserInfoButton({
        //   type: "image",
        //   style: {
        //     left: x,
        //     top: y,
        //     width: width,
        //     height: height,
        //     backgroundColor: "rgba(255, 255, 255, 0)",
        //   },
        // });
        userInfoButtonList[key].onTap((res) => {
            if (res.errMsg.indexOf(':ok') > -1 && !!res.rawData) {
                // 同意
                console.log(res);
                // 用户同意后销毁所有按钮
                destroyAllButton();
                if (callback) {
                    callback(res);
                }
            }
            else {
                // 拒绝
                console.error(res);
            }
        });
    });
}
/**
 * 销毁所有获取信息按钮
 */
function destroyAllButton() {
    for (const key in userInfoButtonList) {
        if (userInfoButtonList[key]) {
            userInfoButtonList[key].destroy();
            delete userInfoButtonList[key];
        }
    }
}
/**
 * 隐藏所有获取信息按钮
 */
function hideUserInfoButton() {
    for (const key in userInfoButtonList) {
        userInfoButtonList[key] && userInfoButtonList[key].hide();
    }
}
/**
 * 展示获取信息按钮
 * @param {String} key
 */
function showUserInfoButton(key) {
    userInfoButtonList[key].show();
}
/**
 * 当触发onShow时，用户可能从设置页返回，此时判断一次是否已授权，已授权则销毁获取信息按钮
 */
setTimeout(() => {
    wx.onShow((res) => {
        console.log(res.scene, res);
        getAuthUserInfo(false, false).then(() => {
            destroyAllButton();
        });
    });
}, 500);
export { scope, AuthKey, requirePrivacyAuthorize, hideUserInfoButton, getAuth, getAuthUserInfo, createUserInfoButton, };
