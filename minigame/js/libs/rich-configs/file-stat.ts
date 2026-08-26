/**
 * stat rich-config
 * 判断文件路径是否是目录：两个可选项（单选）+ 判断按钮
 */

import * as logic from '../../api/file/stat/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '判断文件路径是否是目录',
  apiName: 'stat',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_box, p_button, p_img } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const pathArr = [
      `${wx.env.USER_DATA_PATH}`,
      `${wx.env.USER_DATA_PATH}/fileA/hello.txt`,
    ];

    const div_child_arr: any[] = [];
    for (let i = 0, len = pathArr.length; i < len; i++) {
      div_child_arr[i] = p_box(PIXI, {
        height: 88 * PIXI.ratio,
        border: {
          width: PIXI.ratio | 0,
          color: 0xe5e5e5,
        },
        y:
          i &&
          div_child_arr[i - 1].height +
            div_child_arr[i - 1].y -
            (PIXI.ratio | 0),
      });

      div_child_arr[i].addChild(
        p_text(PIXI, {
          content: pathArr[i],
          fontSize: 34 * PIXI.ratio,
          x: 30 * PIXI.ratio,
          relative_middle: { containerHeight: div_child_arr[i].height },
        }),
      );
    }

    // 单选勾选图标
    const pitch_on = p_img(PIXI, {
      width: 25.6 * PIXI.ratio * 1.2,
      height: 18.4 * PIXI.ratio * 1.2,
      x: div_child_arr[0].width - (38.4 + 25.6 * 1.2) * PIXI.ratio,
      src: 'images/pitch_on.png',
    });
    pitch_on.setPositionFn({
      relative_middle: { containerHeight: div_child_arr[0].height },
    });
    div_child_arr[0].addChild(pitch_on);

    // 点击选项切换选中
    for (let i = 0, len = div_child_arr.length; i < len; i++) {
      div_child_arr[i].onClickFn((e: any) => {
        if (e.target === pitch_on.parent) return;
        pitch_on.parent.removeChild(pitch_on);
        pitch_on.setPositionFn({
          relative_middle: { containerHeight: e.target.height },
        });
        e.target.addChild(pitch_on);
      });
    }

    const divDeploy = {
      height:
        div_child_arr[div_child_arr.length - 1].y +
        div_child_arr[div_child_arr.length - 1].height,
      border: {
        width: PIXI.ratio | 0,
        color: 0xe5e5e5,
      },
      y: underlineBottom + 78 * PIXI.ratio,
    };
    const div = p_box(PIXI, divDeploy);
    div.addChild(...div_child_arr);

    // 点击判断按钮
    const statButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: underlineBottom + 336 * PIXI.ratio,
    });
    statButton.myAddChildFn(
      p_text(PIXI, {
        content: '点击判断',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: statButton.width,
          containerHeight: statButton.height,
        },
      }),
    );
    statButton.onClickFn(() => {
      const selectedIndex = div.getChildIndex(pitch_on.parent);
      logic.statPath(selectedIndex);
    });

    container.addChild(div, statButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
