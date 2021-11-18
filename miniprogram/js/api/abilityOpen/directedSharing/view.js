import { p_text } from "../../../libs/component/index";
import fixedTemplate from "../../../libs/template/fixed";
module.exports = function (PIXI, app, obj, callBack) {
	let container = new PIXI.Container(),
		{ goBack, title, api_name, logo, logoName } = fixedTemplate(PIXI, {
			obj,
			title: "定向分享",
			api_name: "directed sharing",
			underline: false,
		}),
		tipText = p_text(PIXI, {
			content: "提示：拉取同玩好友/可能感兴趣的好友列表\n无需跳出，在小游戏内完成分享流程",
			fontSize: 32 * PIXI.ratio,
			fill: 0xbebebe,
			align: "center",
			lineHeight: 45 * PIXI.ratio,
			y: api_name.height + api_name.y + 830 * PIXI.ratio,
			relative_middle: { containerWidth: obj.width },
		});

	goBack.callBack = () => {
		callBack({ status: "close" });
	};

	container.addChild(goBack, title, api_name, tipText, logo, logoName);

	app.stage.addChild(container);

	return {
		container,
		Yaxis: api_name.y + api_name.height + 10 * PIXI.ratio,
        callBack
	};
};
