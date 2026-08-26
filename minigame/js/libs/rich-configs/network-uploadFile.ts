/**
 * uploadFile rich-config
 * 对齐 demo2：选择图片框（十字线 + 文字），选图上传后展示图片
 */

import * as logic from '../../api/network/uploadFile/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '上传文件',
  apiName: 'uploadFile',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_line, p_box, p_img } = require('../component/index');
    const baseY = underline ? underline.y + underline.height : 0;

    const container = new PIXI.Container();

    const box = p_box(PIXI, {
      y: baseY + 150 * PIXI.ratio,
      height: obj.width / 2,
      border: {
        width: PIXI.ratio | 0,
        color: 0x999999,
      },
    });

    const box_child = new PIXI.Container();
    box_child.y = -20 * PIXI.ratio;
    box_child.addChild(
      p_line(
        PIXI,
        { width: 4 * PIXI.ratio, color: 0x999999 },
        [(obj.width - obj.width / 8) / 2, box.height / 2],
        [obj.width / 8, 0]
      ),
      p_line(
        PIXI,
        { width: 4 * PIXI.ratio, color: 0x999999 },
        [obj.width / 2, (box.height - obj.width / 8) / 2],
        [0, obj.width / 8]
      ),
      p_text(PIXI, {
        content: '选择图片',
        fontSize: 28 * PIXI.ratio,
        fill: 0x999999,
        y: box.height - obj.width / 6,
        relative_middle: { containerWidth: box.width },
      })
    );

    box.addChild(box_child);

    box.onClickFn(() => {
      box.interactive = false;
      logic.chooseImage();
    });

    logic.setOnImage((imageSrc: string) => {
      PIXI.loader.add(imageSrc).load(() => {
        let width: number | undefined,
          height: number | undefined;
        const sprite = p_img(PIXI, {
          src: imageSrc,
          is_PIXI_loader: true,
          y: -PIXI.ratio | 0,
        });
        if (sprite.width > sprite.height) {
          width = box.width;
          height = (width * sprite.height) / sprite.width;
          if (box.height / height < 1) {
            width = (box.height * width) / height;
            height = box.height - ~~PIXI.ratio * 3;
          }
        } else {
          width = (box.height * sprite.width) / sprite.height;
          height = box.height - ~~PIXI.ratio * 3;
        }
        sprite.width = width;
        sprite.height = height;
        sprite.setPositionFn({
          relative_middle: {
            containerWidth: box.width,
            containerHeight: box.height,
          },
        });
        box_child.visible = false;
        box.addChild(sprite);
      });
    });

    container.addChild(box);
    return container;
  },

  actions: [],
};
