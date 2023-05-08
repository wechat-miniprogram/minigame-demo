import fixedTemplate from '../../../libs/template/fixed';
import {
  p_scroll,
  p_button,
  p_text,
  p_circle,
  p_texture
} from '../../../libs/component/index';
import component from './plane-ar'

module.exports = function (PIXI, app, obj, callBack) {
  let container = new PIXI.Container();

  let {
    goBack,
    title,
    underline,
    logo,
    logoName,
    desc,
  } = fixedTemplate(PIXI, {
      obj,
      title: '水平面AR',
      api_name: '',
    }),

    scroll = p_scroll(PIXI, {
      height: obj.height
    }),

    screen = p_texture(PIXI, {
      width: obj.width,
      height: obj.height * 0.8 - (title.height + title.y + 78 * PIXI.ratio),
      y: title.height + title.y + 78 * PIXI.ratio,
      x: 0
    }),

    button = p_button(PIXI, {
      width: 370 * PIXI.ratio,
      height: 80 * PIXI.ratio,
      y: title.height + title.y + 78 * PIXI.ratio,
      alpha: 0,
    });

  button.myAddChildFn(
      p_text(PIXI, {
        // content: '前后置摄像头切换',
        // fontSize: 32 * PIXI.ratio,
        // fill: 0xffffff,
        // relative_middle: {
        //   containerWidth: button.width,
        //   containerHeight: button.height
        // }
      })
    ),

    desc = p_text(PIXI, {
      content: '提示：触碰屏幕任意点, 可在对应位置生成示例的机器小人, \n其中光标标记指示的是水平面',
      fontSize: 26 * PIXI.ratio,
      fill: 0x576b95,
      y: obj.height * 0.85,
      relative_middle: {
        containerWidth: obj.width
      }
    });

  screen.onClickFn(component.onTouchEnd.bind(component));

  component.setData({
    screenTop: -1 + (title.height + title.y + 78 * PIXI.ratio) / obj.height * 2,
    screenBottom: 0.6
  })

  component.onReady(app, {
    track: {
      plane: {
        mode: 3
      },
    },
    version: 'v1',
  });

  goBack.callBack = () => {
    component.onUnload()
  };

  scroll.myAddChildFn(goBack, title, underline, screen, button, logo, logoName, desc);

  container.addChild(scroll);
  app.stage.addChild(container);

  

  app.ticker.add(() => {
    app.renderer.render(app.stage);
    app.renderer.reset();
  })


  return container;
};