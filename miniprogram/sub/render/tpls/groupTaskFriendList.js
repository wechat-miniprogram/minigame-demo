/**
 * 下面的内容分成两部分，第一部分是一个模板，模板的好处是能够有一定的语法
 * 坏处是模板引擎一般都依赖 new Function 或者 eval 能力，小游戏下面是没有的
 * 所以模板的编译需要在外部完成，可以将注释内的模板贴到下面的页面内，点击 "run"就能够得到编译后的模板函数
 * https://wechat-miniprogram.github.io/minigame-canvas-engine/playground.html
 * 如果觉得模板引擎使用过于麻烦，也可以手动拼接字符串，本文件对应函数的目标仅仅是为了创建出 xml 节点数
 */
/*
<view class="container" id="main">
  <view class="rankList">
    <scrollview class="list" scrollY="true">
      {{~it.data :item:index}}
        <view class="listItem">
          <image class="rankAvatar" src="{{= item.avatarUrl || ''}}"></image>
          <text class="rankName" value="{{= item.nickName || '微信用户' }}"></text>
          <text class="countText" value="{{= item.count || '' }}"></text>
        </view>
      {{~}}
        <text class="participantTips" value="{{= it.participantTips || ''}}"></text>
    </scrollview>
  </view>
</view>
*/
/**
 * xml经过doT.js编译出的模板函数
 * 因为小游戏不支持new Function，模板函数只能外部编译
 * 可直接拷贝本函数到小游戏中使用
 */
export default function tplFunc(it) {
    var out = ' <view class="container" id="main"> <view class="rankList"> <scrollview class="list" scrollY="true"> ';
    var arr1 = it.data;
    if (arr1) {
        var item, index = -1, l1 = arr1.length - 1;
        while (index < l1) {
            item = arr1[index += 1];
            out += ' <view class="listItem"> <image class="rankAvatar" src="' + (item.avatarUrl || '') + '"></image> <text class="rankName" value="' + (item.nickName || '微信用户') + '"></text> <text class="countText" value="' + (item.count || '') + '"></text> </view> ';
        }
    }
    out += ' <text class="participantTips" value="' + (it.participantTips || '') + '"></text> </scrollview> </view></view>';
    return out;
}
