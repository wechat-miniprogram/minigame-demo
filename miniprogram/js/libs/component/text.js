module.exports = function (PIXI, deploy = {}) {
  let {
    x = 0,
    y = 0,
    content = "",
    fontSize = 0,
    fill = 0x000000,
    fontWeight = "normal",
    align = "left",
    lineHeight = fontSize * 1.2,
    vertical_center_correction_value = 0,
    relative_middle = {
      containerWidth: null,
      containerHeight: null,
      point: null,
    },
  } = deploy;

  function Text() {
    (this.setPositionFn = function (deploy = {}) {
      let { x: new_x, y: new_y, relative_middle: new_relative_middle } = deploy,
        { containerWidth, containerHeight, point } =
          new_relative_middle || relative_middle;

      new_x =
        new_x ||
        (typeof point === "number" && (new_x = point - this.width / 2)) ||
        x;
      new_y = new_y || y;

      this.position.set(
        containerWidth ? (containerWidth - this.width) / 2 : new_x,
        containerHeight
          ? (containerHeight - this.height + vertical_center_correction_value) /
              2
          : new_y
      );
    }).call(this);

    this.turnColors = function (newColor) {
      this.style.fill = newColor;
    };
    this.turnText = function (str, style) {
      this.toString.call(style) === "[object Object]" &&
        Object.assign(this.style, style);
      this.text = str || content;
      this.setPositionFn();
    };
    this.hideFn = function () {
      this.visible = false;
    };
    this.showFn = function () {
      this.visible = true;
    };
  }
  Text.prototype = new PIXI.Text(content, {
    fontSize: `${fontSize}px`,
    fill,
    align,
    fontWeight,
    lineHeight,
  });
  return new Text();
};
