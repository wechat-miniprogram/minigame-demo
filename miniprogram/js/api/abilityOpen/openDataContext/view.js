import { p_button, p_text, p_box } from "../../../libs/component/index";
import fixedTemplate from "../../../libs/template/fixed";
module.exports = function (PIXI, app, obj, callBack) {
	let container = new PIXI.Container(),
		{ goBack, title, api_name, underline, logo, logoName } = fixedTemplate(PIXI, {
			obj,
			title: "开放数据域",
			api_name: "排行榜",
		}),
		box = p_box(PIXI, {
			y: underline.height + underline.y + 123 * PIXI.ratio,
		}),
		report = p_button(PIXI, {
			width: 300 * PIXI.ratio,
			y: 0,
		}),
		button = p_button(PIXI, {
			width: 300 * PIXI.ratio,
			y: report.height + report.y + 123 * PIXI.ratio,
		}),
		gButton = p_button(PIXI, {
			width: 300 * PIXI.ratio,
			y: button.height + button.y + 123 * PIXI.ratio,
		}),
		olButton = p_button(PIXI, {
			width: 300 * PIXI.ratio,
			y: gButton.height + gButton.y + 123 * PIXI.ratio,
		});

	box.addChild(report, button, gButton, olButton);

	report.myAddChildFn(
		p_text(PIXI, {
			content: `上报随机分数`,
			fontSize: 30 * PIXI.ratio,
			fill: 0xffffff,
			relative_middle: { containerWidth: button.width, containerHeight: button.height },
		})
	);
	button.myAddChildFn(
		p_text(PIXI, {
			content: `查看好友排行`,
			fontSize: 30 * PIXI.ratio,
			fill: 0xffffff,
			relative_middle: { containerWidth: button.width, containerHeight: button.height },
		})
	);
	gButton.myAddChildFn(
		p_text(PIXI, {
			content: `查看群排行`,
			fontSize: 30 * PIXI.ratio,
			fill: 0xffffff,
			relative_middle: { containerWidth: gButton.width, containerHeight: gButton.height },
		})
	);

	olButton.myAddChildFn(
		p_text(PIXI, {
			content: `查看在线好友`,
			fontSize: 30 * PIXI.ratio,
			fill: 0xffffff,
			relative_middle: { containerWidth: olButton.width, containerHeight: olButton.height },
		})
	);

	let close = p_button(PIXI, {
			width: 300 * PIXI.ratio,
			y: (obj.height - 200 * PIXI.ratio) | 0,
			x: obj.width - 350 * PIXI.ratio,
		}),
		closeText,
		closeTextTrigger = 0;

	close.myAddChildFn(
		(closeText = p_text(PIXI, {
			content: `关闭排行`,
			fontSize: 32 * PIXI.ratio,
			fill: 0xffffff,
			relative_middle: { containerWidth: button.width, containerHeight: button.height },
		}))
	);

	close.onClickFn(() => {
		container.removeChild(close);
		container.removeChild(subscribe);
		box.showFn();
		callBack({
			status: "close",
		});
	});

	let subscribe = p_button(PIXI, {
		width: 300 * PIXI.ratio,
		y: (obj.height - 200 * PIXI.ratio) | 0,
		x: 50 * PIXI.ratio,
	});

	subscribe.myAddChildFn(
		p_text(PIXI, {
			content: `订阅消息`,
			fontSize: 32 * PIXI.ratio,
			fill: 0xffffff,
			relative_middle: { containerWidth: button.width, containerHeight: button.height },
		})
	);

	subscribe.onClickFn(() => {
		callBack({
			status: "subscribe",
		});
	});

	function buttonState(state, method, ignore){
		box[state]();
		container[method](close);
		!ignore && container[method](subscribe);
	}

	button.onClickFn(() => {
		closeTextTrigger && closeText.turnText("关闭排行"), (closeTextTrigger = 0);
		buttonState('hideFn','addChild');

		callBack({
			status: "showFriendRank",
		});
	});

	gButton.onClickFn(() => {
		closeTextTrigger && closeText.turnText("关闭排行"), (closeTextTrigger = 0);
		callBack({
			status: "shareAppMessage",
		});
	});

	report.onClickFn(() => {
		callBack({
			status: "setUserRecord",
		});
	});

	olButton.onClickFn(() => {
		!closeTextTrigger && closeText.turnText("关闭列表"), (closeTextTrigger = 1);
		buttonState('hideFn','addChild', true);

		callBack({
			status: "showFriendsOnlineStatus",
		});
	});

	goBack.callBack = () => {
		buttonState('showFn','removeChild');

		callBack({ status: "close" });
	};

	window.router.getNowPage(page => {
        page.reload = function() {
            logo.reloadImg({ src: 'images/logo.png' });
			callBack({ status: "restart" });
        };
    });

	container.addChild(goBack, title, api_name, underline, box, logo, logoName);

	app.stage.addChild(container);

	return { container, close , box};
};
