/*
{{? !it.data.button }}

  {{? !it.isBillboard }}
  <view class="containerOther" id="main">
  {{?}}

  {{? it.title }}
  <view class="container" id="main">
    <view class="header">
      <text class="title" value="{{= it.title }}"></text>
    </view>
  {{?}}

    {{? it.isBillboard }}
    <view class="rankList ">
    {{?}}

    {{? !it.isBillboard }}
    <view class="rankList rankOtherList {{? it.data.potential }}ranklistDirected{{?}} ">
    {{?}}

        {{? it.data.potential }}
        <view class="AD">
          <text class="ADtext" value="活动图片"></text>
          <view class="ADmask"></view>
        </view>
        <view class="caption">
          <text class="captionLeftText" value="好友列表"></text>
          <view class="captionRight">
            <image class="captionRightImg" src="sub/img/refresh.png"></image>
            <text class="captionRightText" value="换一组"></text>
          </view>
        </view>
        {{?}}

        {{? it.isBillboard }}
        <scrollview class="list" scrollY="true">
        {{?}}

        {{? !it.isBillboard }}
          <scrollview scrollY="true" class="list listOther {{? it.data.potential }}listDirected{{?}}">
        {{?}}

            {{~it.data :item:index}}
                {{? !it.data.onLine && it.isBillboard && index % 2 === 1 }}
                <view class="listItem listItemOld">
                {{?}}

                {{? !it.data.onLine && it.isBillboard && index % 2 === 0  }}
                <view class="listItem">
                {{?}}

				{{? it.data.onLine }}
                <view class="listItem listItemOld">
                {{?}}

                {{? !it.isBillboard }}
                <view class="listItem listItemOld listItemOther">
                {{?}}

                    {{? it.isBillboard}}
                    <text class="listItemNum" value="{{= index + 1}}"></text>
                    <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                    <text class="listItemName" value="{{= item.nickname || item.nickName}}"></text>
						{{? it.data.onLine }}
							<text class="listItemScore  listItemState{{? item.sysState}}Green{{??}}Gray{{?}}" value="{{= item.sysState ? '在线' : '离线'}}"></text>
							{{??}}
							<text class="listItemScore" value="{{= item.score}}"></text>
                    		<text class="listScoreUnit" value="分"></text>
						{{?}}

                    {{?}}

                    {{? !it.isBillboard}}
                    <image class="listHeadImg headImg" src="{{= item.avatarUrl }}"></image>
                    <text class="listItemName name" value="{{= item.nickname.length > 10 ? item.nickname.slice(0,10)+'...' : item.nickname}}"></text>
                    <view class="itemButton">
                      <text class="itemButtonText" value=" 
                      {{? !it.data.potential }}送金币{{?}}
                      {{? it.data.potential }}邀请{{?}}
                      "></text>
                    </view>
                    {{?}}
                </view>
            {{~}}
        </scrollview>

        {{? it.isBillboard}}
        <text class="listTips" value="仅展示{{= it.data.onLine?'20位好友的在线状态':'前20位好友排名'}}"></text>
			{{? !it.data.onLine}}
			<view class="listItem selfListItem">
				<text class="listItemNum" value="{{= it.selfIndex}}"></text>
				<image class="listHeadImg" src="{{= it.self.avatarUrl }}"></image>
				<text class="listItemName" value="{{= it.self.nickname.length > 10 ? it.self.nickname.slice(0,10)+'...' : it.self.nickname }}"></text>
				<text class="listItemScore" value="{{= it.self.score}}"></text>
				<text class="listScoreUnit" value="分"></text>
			</view>
			{{?}}
        {{?}}
    </view>
  </view>

{{??}}
<view class="container" id="main">
    <view class="{{? it.data.isEnabled}}h{{??}}failH{{?}}andoffBtn {{= it.data.className }}">
      <text class="{{? it.data.isEnabled}}h{{??}}failH{{?}}andoffBtnText" value="{{= it.data.content }}"></text>
    </view>
</view>
{{?}}
*/

// 模板在这里维护
// https://codepen.io/yuanzm/pen/MYYYbdy?editors=1010

/**
 * xml经过doT.js编译出的模板函数
 * 因为小游戏不支持new Function，模板函数只能外部编译
 * 可直接拷贝本函数到小游戏中使用
 */
export default function tplFunc(it) {
  var out = '';
  if (!it.data.button) {
    out += ' ';
    if (!it.isBillboard) {
      out += ' <view class="containerOther" id="main"> ';
    }
    out += ' ';
    if (it.title) {
      out += ' <view class="container" id="main"> <view class="header"> <text class="title" value="' + (it.title) + '"></text> </view> ';
    }
    out += ' ';
    if (it.isBillboard) {
      out += ' <view class="rankList "> ';
    }
    out += ' ';
    if (!it.isBillboard) {
      out += ' <view class="rankList rankOtherList ';
      if (it.data.potential) {
        out += 'ranklistDirected';
      }
      out += ' "> ';
    }
    out += ' ';
    if (it.data.potential) {
      out += ' <view class="AD"> <text class="ADtext" value="活动图片"></text> <view class="ADmask"></view> </view> <view class="caption"> <text class="captionLeftText" value="好友列表"></text> <view class="captionRight"> <image class="captionRightImg" src="sub/img/refresh.png"></image> <text class="captionRightText" value="换一组"></text> </view> </view> ';
    }
    out += ' ';
    if (it.isBillboard) {
      out += ' <scrollview class="list" scrollY="true"> ';
    }
    out += ' ';
    if (!it.isBillboard) {
      out += ' <scrollview scrollY="true" class="list listOther ';
      if (it.data.potential) {
        out += 'listDirected';
      }
      out += '"> ';
    }
    out += ' ';
    var arr1 = it.data;
    if (arr1) {
      var item, index = -1,
        l1 = arr1.length - 1;
      while (index < l1) {
        item = arr1[index += 1];
        out += ' ';
        if (!it.data.onLine && it.isBillboard && index % 2 === 1) {
          out += ' <view class="listItem listItemOld"> ';
        }
        out += ' ';
        if (!it.data.onLine && it.isBillboard && index % 2 === 0) {
          out += ' <view class="listItem"> ';
        }
        if (it.data.onLine) {
          out += ' <view class="listItem listItemOld"> ';
        }
        out += ' ';
        if (!it.isBillboard) {
          out += ' <view class="listItem listItemOld listItemOther"> ';
        }
        out += ' ';
        if (it.isBillboard) {
          out += ' <text class="listItemNum" value="' + (index + 1) + '"></text> <image class="listHeadImg" src="' + (item.avatarUrl) + '"></image> <text class="listItemName" value="' + (item.nickname || item.nickName) + '"></text>';
          if (it.data.onLine) {
            out += '<text class="listItemScore  listItemState';
            if (item.sysState) {
              out += 'Green';
            } else {
              out += 'Gray';
            }
            out += '" value="' + (item.sysState ? '在线' : '离线') + '"></text>';
          } else {
            out += '<text class="listItemScore" value="' + (item.score) + '"></text> <text class="listScoreUnit" value="分"></text>';
          }
          out += ' ';
        }
        out += ' ';
        if (!it.isBillboard) {
          out += ' <image class="listHeadImg headImg" src="' + (item.avatarUrl) + '"></image> <text class="listItemName name" value="' + (item.nickname) + '"></text> <view class="itemButton"> <text class="itemButtonText" value="                       ';
          if (!it.data.potential) {
            out += '送金币';
          }
          out += ' ';
          if (it.data.potential) {
            out += '邀请';
          }
          out += ' "></text> </view> ';
        }
        out += ' </view> ';
      }
    }
    out += ' </scrollview> ';
    if (it.isBillboard) {
      out += ' <text class="listTips" value="仅展示' + (it.data.onLine ? '20位好友的在线状态' : '前20位好友排名') + '"></text>';
      if (!it.data.onLine) {
        out += '<view class="listItem selfListItem"><text class="listItemNum" value="' + (it.selfIndex) + '"></text><image class="listHeadImg" src="' + (it.self.avatarUrl) + '"></image><text class="listItemName" value="' + (it.self.nickname) + '"></text><text class="listItemScore" value="' + (it.self.score) + '"></text><text class="listScoreUnit" value="分"></text></view>';
      }
      out += ' ';
    }
    out += ' </view> </view>';
  } else {
    out += '<view class="container" id="main"> <view class="';
    if (it.data.isEnabled) {
      out += 'h';
    } else {
      out += 'failH';
    }
    out += 'andoffBtn ' + (it.data.className) + '"> <text class="';
    if (it.data.isEnabled) {
      out += 'h';
    } else {
      out += 'failH';
    }
    out += 'andoffBtnText" value="' + (it.data.content) + '"></text> </view></view>';
  }
  return out;
}