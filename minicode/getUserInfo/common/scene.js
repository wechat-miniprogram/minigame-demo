class Screen {
  scenes = [
    {
      title: "首页场景",
      background: "#07c160",
    },
    {
      title: "其他场景",
      background: "#07c1a7",
    },
    {
      title: "结算场景",
      background: "#c17a07",
    },
  ];
  currentIndex = 0;

  get currentScene() {
    return this.scenes[this.currentIndex];
  };
  
  changeScene(index) {
    this.currentIndex = index;
  };
  
  nextScene() {
    this.currentIndex += 1;
    if (this.currentIndex > this.scenes.length - 1) {
      this.currentIndex = 0;
    }
  };
  
  preScene() {
    this.currentIndex -= 1;
    if (this.currentIndex < 0) {
      this.currentIndex = this.scenes.length - 1;
    }
  };
}

export const scene = new Screen();