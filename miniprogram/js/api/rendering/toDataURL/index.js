import view from './view';
import show from '../../../libs/show';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, res => {
        let { status, base64 } = res;
        switch (status) {
            case 'toDataURL':
                // 把画布内容转换为URL
                base64 = canvas.toDataURL();
                show.Modal(base64, '转换成功');
                console.log(base64);
                break;
        }
    });
};
