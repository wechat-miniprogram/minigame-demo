const Layout = requirePlugin('Layout').default;

export function bindCheckHandoffEnabled(type) {
    const button = Layout.getElementsByClassName(type.className)[0];

    button.on('click', () => {
        try {
            wx.checkHandoffEnabled({
                success: type.success,
                fail: type.fail,
            });
        } catch (error) {
            type.fail(error);
        }
    });
}

export function bindStartHandoff(type) {
    const button = Layout.getElementsByClassName(type.className)[0];

    button.on('click', () => {
        wx.startHandoff();
    });
}
