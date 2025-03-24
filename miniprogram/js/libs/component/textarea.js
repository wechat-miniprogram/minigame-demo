module.exports = function(PIXI, deploy = {}) {
    let {
        width = canvas.width - 80 * PIXI.ratio,
        height = 120 * PIXI.ratio,
        parentWidth = canvas.width,
        background = {
            color: 0xffffff,
            alpha: 1
        },
        border = {
            width: 1,
            color: 0xcccccc,
            alpha: 1
        },
        fontSize = 28 * PIXI.ratio,
        padding = 20 * PIXI.ratio,
        lineHeight = 36 * PIXI.ratio,
        text = {
            content: '',
            color: 0x000000,
        },
        placeholder = {
            content: '请输入内容',
            color: 0x999999
        },
        x = (parentWidth - width) / 2,
        y = 0,
        radius = 8 * PIXI.ratio,
        maxLength = 15
    } = deploy;

    function Textarea() {
        // 创建容器
        let container = new PIXI.Container(),
            // 背景
            background_layer = new PIXI.Graphics(),
            // 文本显示
            content_text = new PIXI.Text(text.content, {
                fontSize: fontSize,
                fill: text.color,
                wordWrap: true,
                wordWrapWidth: width - padding * 2,
                lineHeight: lineHeight
            }),
            // placeholder显示
            placeholder_text = new PIXI.Text(placeholder.content, {
                fontSize: fontSize,
                fill: placeholder.color,
                wordWrap: true,
                wordWrapWidth: width - padding * 2,
                lineHeight: lineHeight
            });

        // 设置位置
        this.position.set(x, y);
        
        // 绘制背景
        background_layer.lineStyle(border.width, border.color, border.alpha)
            .beginFill(background.color, background.alpha)
            .drawRoundedRect(0, 0, width, height, radius)
            .endFill();

        // 设置文本位置
        content_text.position.set(padding, padding);
        placeholder_text.position.set(padding, padding);

        // 添加到容器
        container.addChild(background_layer, content_text, placeholder_text);
        this.addChild(container);

        // 当前文本内容
        let current_text = '';

        // 处理输入法
        const handleKeyboardInput = (res) => {
            current_text = res.value;
            content_text.text = current_text;
            placeholder_text.visible = !current_text;
        };

        const handleKeyboardConfirm = (res) => {
            current_text = res.value;
            content_text.text = current_text;
            placeholder_text.visible = !current_text;
            wx.hideKeyboard();
            this.onConfirm && this.onConfirm(current_text);
        };

        // 绑定点击事件
        this.onConfirmFn = function(callBack) {
            container.interactive = true;
            container.touchstart = e => {
                // 先显示键盘
                wx.showKeyboard({
                    defaultValue: current_text,
                    maxLength: maxLength,
                    multiple: false,
                    confirmHold: false,
                    confirmType: 'done',
                    success: () => {
                        // 键盘显示成功后再绑定事件监听
                        wx.onKeyboardInput(handleKeyboardInput);
                        wx.onKeyboardConfirm(handleKeyboardConfirm);
                        this.onFocus && this.onFocus();
                    },
                    fail: (err) => {
                        console.error('显示键盘失败：', err);
                    }
                });

                // 添加键盘收起事件监听
                wx.onKeyboardComplete(() => {
                    cleanup();
                });
            };

            // 保存回调
            this.onConfirm = callBack;
        };

        // 清理事件监听
        const cleanup = () => {
            wx.offKeyboardInput(handleKeyboardInput);
            wx.offKeyboardConfirm(handleKeyboardConfirm);
            wx.offKeyboardComplete();
        };

        // 设置文本内容
        this.setText = function(str) {
            current_text = str || '';
            content_text.text = current_text;
            placeholder_text.visible = !current_text;
        };

        // 获取文本内容
        this.getText = function() {
            return current_text;
        };

        // 设置placeholder
        this.setPlaceholder = function(str) {
            placeholder_text.text = str;
        };

        // 清空内容
        this.clear = function() {
            this.setText('');
        };

        // 禁用/启用输入
        this.setDisabled = function(disabled) {
            container.interactive = !disabled;
            if (disabled) {
                cleanup();
                wx.hideKeyboard();
            }
        };

        // 显示/隐藏
        this.hideFn = function() {
            container.visible = false;
            cleanup();
            wx.hideKeyboard();
        };
        
        this.showFn = function() {
            container.visible = true;
        };

        // 组件销毁时清理事件
        this.destroy = function() {
            cleanup();
            wx.hideKeyboard();
            PIXI.Container.prototype.destroy.call(this);
        };
    }

    Textarea.prototype = new PIXI.Container();
    return new Textarea();
}; 