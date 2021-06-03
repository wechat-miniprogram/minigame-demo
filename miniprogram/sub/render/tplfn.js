
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
        <scrollview class="list">
        {{?}}

        {{? !it.isBillboard }}
          <scrollview class="list listOther {{? it.data.potential }}listDirected{{?}}">
        {{?}}

            {{~it.data :item:index}}
                {{? index % 2 === 1 && it.isBillboard }}
                <view class="listItem listItemOld">
                {{?}}

                {{? index % 2 === 0 && it.isBillboard }}
                <view class="listItem">
                {{?}}

                {{? !it.isBillboard }}
                <view class="listItem listItemOld listItemOther">
                {{?}}

                    {{? it.isBillboard}}
                    <text class="listItemNum" value="{{= index + 1}}"></text>
                    <image class="listHeadImg" src="{{= item.avatarUrl }}"></image>
                    <text class="listItemName" value="{{= item.nickname.length > 10 ? item.nickname.slice(0,10)+'...' : item.nickname}}"></text>
                    <text class="listItemScore" value="{{= item.score}}"></text>
                    <text class="listScoreUnit" value="分"></text>
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
        <text class="listTips" value="仅展示前20位好友排名"></text>

        <view class="listItem selfListItem">
            <text class="listItemNum" value="{{= it.selfIndex}}"></text>
            <image class="listHeadImg" src="{{= it.self.avatarUrl }}"></image>
            <text class="listItemName" value="{{= it.self.nickname.length > 10 ? it.self.nickname.slice(0,10)+'...' : it.self.nickname }}"></text>
            <text class="listItemScore" value="{{= it.self.score}}"></text>
            <text class="listScoreUnit" value="分"></text>
        </view>
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

// 上述模板经过模板引擎编译成版本函数，可通过olado.github.io/doT/index.html在线获得
export default function anonymous(it ) { var out='';if(!it.data.button){out+=' ';if(!it.isBillboard){out+=' <view class="containerOther" id="main"> ';}out+=' ';if(it.title){out+=' <view class="container" id="main"> <view class="header"> <text class="title" value="'+( it.title )+'"></text> </view> ';}out+=' ';if(it.isBillboard){out+=' <view class="rankList "> ';}out+=' ';if(!it.isBillboard){out+=' <view class="rankList rankOtherList ';if(it.data.potential){out+='ranklistDirected';}out+=' "> ';}out+=' ';if(it.data.potential){out+=' <view class="AD"> <text class="ADtext" value="活动图片"></text> <view class="ADmask"></view> </view> <view class="caption"> <text class="captionLeftText" value="好友列表"></text> <view class="captionRight"> <image class="captionRightImg" src="sub/img/refresh.png"></image> <text class="captionRightText" value="换一组"></text> </view> </view> ';}out+=' ';if(it.isBillboard){out+=' <scrollview class="list"> ';}out+=' ';if(!it.isBillboard){out+=' <scrollview class="list listOther ';if(it.data.potential){out+='listDirected';}out+='"> ';}out+=' ';var arr1=it.data;if(arr1){var item,index=-1,l1=arr1.length-1;while(index<l1){item=arr1[index+=1];out+=' ';if(index % 2 === 1 && it.isBillboard){out+=' <view class="listItem listItemOld"> ';}out+=' ';if(index % 2 === 0 && it.isBillboard){out+=' <view class="listItem"> ';}out+=' ';if(!it.isBillboard){out+=' <view class="listItem listItemOld listItemOther"> ';}out+=' ';if(it.isBillboard){out+=' <text class="listItemNum" value="'+( index + 1)+'"></text> <image class="listHeadImg" src="'+( item.avatarUrl )+'"></image> <text class="listItemName" value="'+( item.nickname.length > 10 ? item.nickname.slice(0,10)+'...' : item.nickname)+'"></text> <text class="listItemScore" value="'+( item.score)+'"></text> <text class="listScoreUnit" value="分"></text> ';}out+=' ';if(!it.isBillboard){out+=' <image class="listHeadImg headImg" src="'+( item.avatarUrl )+'"></image> <text class="listItemName name" value="'+( item.nickname.length > 10 ? item.nickname.slice(0,10)+'...' : item.nickname)+'"></text> <view class="itemButton"> <text class="itemButtonText" value=" ';if(!it.data.potential){out+='送金币';}out+=' ';if(it.data.potential){out+='邀请';}out+=' "></text> </view> ';}out+=' </view> ';} } out+=' </scrollview> ';if(it.isBillboard){out+=' <text class="listTips" value="仅展示前20位好友排名"></text> <view class="listItem selfListItem"> <text class="listItemNum" value="'+( it.selfIndex)+'"></text> <image class="listHeadImg" src="'+( it.self.avatarUrl )+'"></image> <text class="listItemName" value="'+( it.self.nickname.length > 10 ? it.self.nickname.slice(0,10)+'...' : it.self.nickname )+'"></text> <text class="listItemScore" value="'+( it.self.score)+'"></text> <text class="listScoreUnit" value="分"></text> </view> ';}out+=' </view> </view>';}else{out+='<view class="container" id="main"> <view class="';if(it.data.isEnabled){out+='h';}else{out+='failH';}out+='andoffBtn '+( it.data.className )+'"> <text class="';if(it.data.isEnabled){out+='h';}else{out+='failH';}out+='andoffBtnText" value="'+( it.data.content )+'"></text> </view></view>';}return out; }