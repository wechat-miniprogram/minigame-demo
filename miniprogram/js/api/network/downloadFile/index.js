import view from './view';
import { downloadFile } from '../apiList';
module.exports = function(PIXI, app, obj) {
    return view(PIXI, app, obj, func => {
        downloadFile(res => {
            let tempFilePath = res.tempFilePath;
            func(tempFilePath); //绘制图片
        });
    });
};
