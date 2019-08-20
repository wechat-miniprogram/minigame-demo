const signIn = [
    {
        name: 'APIentry',
        path: 'APIentry/index',
        tabBar: 'index',
        children: [
            {
                name: 'abilityOpen',
                children: [
                    {
                        name: 'userInfo',
                        path: 'abilityOpen/userInfo/index'
                    },
                    {
                        name: 'appletCode',
                        path: 'abilityOpen/appletCode/index'
                    },
                    {
                        name: 'transpond',
                        path: 'abilityOpen/transpond/index'
                    }
                ]
            },
            {
                name: 'rendering',
                path: 'rendering/index'
            },
            {
                name: 'facility',
                path: 'facility/index'
            },
            {
                name: 'network',
                children: [
                    {
                        name: 'request',
                        path: 'network/request/index'
                    },
                    {
                        name: 'downloadFile',
                        path: 'network/downloadFile/index'
                    },
                    {
                        name: 'uploadFile',
                        path: 'network/uploadFile/index'
                    },
                    {
                        name: 'WebSocket',
                        path: 'network/webSocket/index'
                    }
                ]
            },
            {
                name: 'media',
                children: [
                    {
                        name: 'video',
                        path: 'media/video/index'
                    },
                    {
                        name: 'voiceFrequency',
                        path: 'media/voiceFrequency/index'
                    }
                ]
            },
            {
                name: 'fileSystemManager',
                path: 'fileSystemManager/index'
            },

            {
                name: 'worker',
                path: 'worker/index'
            }
        ]
    }
];

function router(PIXI, app, parameter) {
    let treePage = {};
    function regroup(arr) {
        let circularArr = arr;
        while (circularArr.length) {
            let page = circularArr.shift();
            parameter = { ...parameter };
            parameter.name = page.name;
            parameter.isTabBar = !!page.tabBar;
            page.path &&
                (treePage[page.name] = {
                    path: page.path,
                    parameter
                });
            if ((page.children || []).length) circularArr.unshift(...page.children);
        }
    }
    regroup(signIn);

    treePage.APIentry.page = require(treePage.APIentry.path)(PIXI, app, treePage.APIentry.parameter);
    treePage.APIentry.init = true;

    window.router = new (function() {
        this.treeView = ['APIentry'];
        this.to = function(newPage) {
            let lastOne = this.treeView.length - 1,
                name = this.treeView[lastOne];
            if (name === newPage) return;
            if (!treePage[newPage].init) {
                treePage[newPage].page = require(treePage[newPage].path)(PIXI, app, treePage[newPage].parameter);
                treePage[newPage].init = true;
            }
            this.treeView.push(newPage);
            treePage[name].page.visible = false;
            treePage[newPage].page.visible = true;
        };
        this.goBack = function() {
            treePage[this.treeView.pop()].page.visible = false;
            treePage[this.treeView[this.treeView.length - 1]].page.visible = true;
        };
    })();
}
module.exports = router;
