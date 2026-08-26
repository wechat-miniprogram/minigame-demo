/**
 * dir rich-config
 * 创建/删除目录：根据 fileA 是否存在切换显示
 */

import * as logic from '../../api/file/dir/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '创建/删除目录',
  apiName: 'dir',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_box, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const mkdirButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: underlineBottom + 123 * PIXI.ratio,
    });

    const div = new PIXI.Container();

    const pathBox = p_box(PIXI, {
      height: 92.5 * PIXI.ratio,
      border: { width: PIXI.ratio, color: 0xe5e5e5 },
      y: underlineBottom + 102 * PIXI.ratio,
    });

    const tipText = p_text(PIXI, {
      content: '提示：上面显示的路径是已创建了的',
      fontSize: 32 * PIXI.ratio,
      fill: 0xbebebe,
      y: underlineBottom + 213 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const rmdirButton = p_button(PIXI, {
      width: mkdirButton.width,
      y: tipText.y + tipText.height + 60 * PIXI.ratio,
    });

    pathBox.addChild(
      p_text(PIXI, {
        content: `${wx.env.USER_DATA_PATH}/fileA`,
        fontSize: 36 * PIXI.ratio,
        relative_middle: {
          containerWidth: pathBox.width,
          containerHeight: pathBox.height,
        },
      }),
    );

    mkdirButton.myAddChildFn(
      p_text(PIXI, {
        content: '创建目录',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: mkdirButton.width,
          containerHeight: mkdirButton.height,
        },
      }),
    );
    mkdirButton.onClickFn(() => {
      logic.mkdir(() => {
        div.visible = true;
        mkdirButton.hideFn();
      });
    });

    rmdirButton.myAddChildFn(
      p_text(PIXI, {
        content: '删除目录',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: rmdirButton.width,
          containerHeight: rmdirButton.height,
        },
      }),
    );
    rmdirButton.onClickFn(() => {
      logic.rmdir(() => {
        div.visible = false;
        mkdirButton.showFn();
      });
    });

    div.visible = false;
    mkdirButton.hideFn();
    logic.checkDirExists().then((exists) => {
      if (exists) {
        div.visible = true;
      } else {
        div.visible = false;
        mkdirButton.showFn();
      }
    });

    div.addChild(pathBox, tipText, rmdirButton);
    container.addChild(div, mkdirButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
