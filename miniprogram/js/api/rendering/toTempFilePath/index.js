import view from './view';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status,deploy,drawFn } = res;
        switch (status) {
            case 'toTempFilePath':
                // 将当前 Canvas 保存为一个临时文件
                canvas.toTempFilePath({
                    ...deploy,
                    success(res){
                        drawFn(res) // 更新UI
                        console.log(res)
                    }
                });
   
                break;
        }
    });
};
