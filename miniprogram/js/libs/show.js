module.exports = {
    Modal(content, title, callback) {
        if (typeof title === 'function') {
            callback = title;
            title = void 0;
        }

        wx.showModal({
            title: title || '提示',
            content,
            showCancel: false,
            confirmColor:'#02BB00',
            success() {
                callback && callback();
            }
        });
    },
    Toast(content, icon = 'none', duration = 1500) {
        wx.showToast({
            title: content,
            icon,
            duration,
            mask: true
        });
    },
    ActionSheet(itemList, callback) {
        wx.showActionSheet({
            itemList,
            success(res) {
                callback && callback(res);
            },
            fail(res) {
                callback && callback(res);
            }
        });
    }
};
