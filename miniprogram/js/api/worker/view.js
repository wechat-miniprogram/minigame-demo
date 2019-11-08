module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = {
            button: new PIXI.Graphics(),
            arrow: new PIXI.Graphics()
        },
        background = new PIXI.Graphics(),
        title = new PIXI.Text('多线程 Worker', {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0xffffff
        }),
        line = new PIXI.Graphics(),
        box = new PIXI.Graphics(),
        hint = new PIXI.Text(
            '提示: 使用单线程进行计算时，动画会出现明显的\n卡顿现象。使用 Worker 线程进行计算，则可以保\n证动画的流畅。',
            {
                fontSize: `${28 * PIXI.ratio}px`,
                fill: 0x777777
            }
        ),
        fabonacciIndex = 35,
        fabonacciText = new PIXI.Text(`当前计算斐波拉契数列的第${fabonacciIndex}个数`, {
            fontSize: `${28 * PIXI.ratio}px`,
            fill: 0x333333
        });

    goBack.button.position.set(0, 52 * Math.ceil(PIXI.ratio));
    goBack.button
        .beginFill(0xffffff, 0)
        .drawRect(0, 0, 80 * PIXI.ratio, 80 * PIXI.ratio)
        .endFill();
    goBack.arrow
        .lineStyle(5 * PIXI.ratio, 0xffffff)
        .moveTo(50 * PIXI.ratio, 20 * PIXI.ratio)
        .lineTo(30 * PIXI.ratio, 40 * PIXI.ratio)
        .lineTo(50 * PIXI.ratio, 60 * PIXI.ratio);

    background
        .beginFill(0x000000)
        .drawRect(0, 0, obj.width, obj.height)
        .endFill();

    title.position.set((obj.width - title.width) / 2, 180 * PIXI.ratio);

    line.beginFill(0xffffff)
        .drawRect(0, 0, title.width, 1 * PIXI.ratio)
        .endFill();
    line.position.set((obj.width - title.width) / 2, title.y + title.height + 10 * PIXI.ratio);

    box.position.set(30 * PIXI.ratio, obj.height - 420 * PIXI.ratio);
    box.beginFill(0xffffff)
        .drawRoundedRect(0, 0, obj.width - box.x * 2, 180 * PIXI.ratio, 10 * PIXI.ratio)
        .endFill();
    hint.position.set((box.width - hint.width) / 2, box.height / 10);
    fabonacciText.position.set(hint.x, hint.y + hint.height + box.height / 10);

    let button,
        siteY,
        buttonArr = [];
    function drawButtonFn(text, y) {
        button = new PIXI.Graphics();
        text = new PIXI.Text(text, {
            fontSize: `${30 * PIXI.ratio}px`,
            fill: 0xffffff
        });
        button.position.set(30 * PIXI.ratio, y);
        button
            .beginFill(0x07c160)
            .drawRoundedRect(0, 0, obj.width - button.x * 2, 80 * PIXI.ratio, 10 * PIXI.ratio)
            .endFill();
        button.addChild(text);
        text.position.set((button.width - text.width) / 2, (button.height - text.height) / 2);
        button.interactive = true;
        siteY = button.height + button.y;
        buttonArr.push(button);
    }

    drawButtonFn('单线程计算', box.y + box.height + 20 * PIXI.ratio);
    button.touchend = () => {
        callBack({
            status: 'noWorker',
            fabonacciIndex,
            draw() {
                fabonacciIndex = fabonacciIndex === 35 ? 37 : 35;
                fabonacciText.text = `当前计算斐波拉契数列的第${fabonacciIndex}个数`;
            }
        });
    };

    //Worker start
    drawButtonFn('利用 Worker 线程计算', siteY + 20 * PIXI.ratio);
    button.touchend = () => {
        callBack({
            status: 'Worker',
            fabonacciIndex,
            draw() {
                fabonacciIndex = fabonacciIndex === 35 ? 37 : 35;
                fabonacciText.text = `当前计算斐波拉契数列的第${fabonacciIndex}个数`;
            }
        });
    };
    //Worker end

    let cameraZ = 0,
        speed = 0,
        warpSpeed = 0,
        time = 0;
    const starAmount = 1000,
        fov = 20,
        baseSpeed = 0.025,
        starStretch = 5,
        starBaseSize = 0.05;

    // Create the stars
    const stars = [];
    for (let i = 0; i < starAmount; i++) {
        const star = {
            sprite: new PIXI.Sprite(PIXI.loader.resources['images/star.png'].texture),
            z: 0,
            x: 0,
            y: 0
        };
        star.sprite.anchor.x = 0.5;
        star.sprite.anchor.y = 0.7;
        randomizeStar(star, true);
        background.addChild(star.sprite);
        stars.push(star);
    }

    function randomizeStar(star, initial) {
        star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

        // Calculate star positions with radial random coordinate so no star hits the camera.
        const deg = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 1;
        star.x = Math.cos(deg) * distance;
        star.y = Math.sin(deg) * distance;
    }

    // Listen for animate update
    function delta(delta) {
        // Change flight speed every 350 delta
        if ((time += delta) >= 300) {
            warpSpeed = warpSpeed > 0 ? 0 : 1;
            time = 0;
        }

        // Simple easing. This should be changed to proper easing function when used for real.
        speed += (warpSpeed - speed) / 20;
        cameraZ += delta * 20 * (speed + baseSpeed) * (warpSpeed || 10);
        for (let i = 0; i < starAmount; i++) {
            const star = stars[i];
            if (star.z < cameraZ) randomizeStar(star);

            // Map star 3d position to 2d with really simple projection
            const z = star.z - cameraZ;
            star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
            star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;

            // Calculate star scale & rotation.
            const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
            const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
            const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter + dyCenter);
            const distanceScale = Math.max(0, (2000 - z) / 2000);
            star.sprite.scale.x = distanceScale * starBaseSize;
            // Star is looking towards center so that y axis is towards center.
            // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
            star.sprite.scale.y =
                distanceScale * starBaseSize +
                (distanceScale * speed * starStretch * distanceCenter) / app.renderer.screen.width;
            star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
        }
    }
    goBack.button.interactive = true;
    goBack.button.touchend = () => {
        window.router.navigateBack();
    };

    goBack.button.addChild(goBack.arrow);
    box.addChild(hint, fabonacciText);
    container.addChild(background, goBack.button, title, line, box, ...buttonArr);
    let visible = (container.visible = false);
    app.stage.addChild(container);

    Object.defineProperty(container, 'visible', {
        get() {
            return visible;
        },
        set(value) {
            visible = value;
            visible ? app.ticker.add(delta) : app.ticker.remove(delta);
        }
    });

    return container;
};
