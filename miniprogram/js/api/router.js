import APIentry from './APIentry/index';
import fileSystemManager from './fileSystemManager/index';
import request from './network/request/index';
import downloadFile from './network/downloadFile/index';
import uploadFile from './network/uploadFile/index';
import WebSocket from './network/webSocket/index';
import rendering from './rendering/index';
import voiceFrequency from './media/voiceFrequency/index';
import video from './media/video/index';
import worker from './worker/index';
import userInfo from './abilityOpen/userInfo/index';
import appletCode from './abilityOpen/appletCode/index';
import transpond from './abilityOpen/transpond/index';
import facility from './facility/index';

const signIn = [
    {
        name: 'APIentry',
        page: APIentry,
        children: [
            {
                name: 'abilityOpen',
                children: [
                    {
                        name: 'userInfo',
                        page: userInfo
                    },
                    {
                        name: 'appletCode',
                        page: appletCode
                    },
                    {
                        name: 'transpond',
                        page: transpond
                    }
                ]
            },
            {
                name: 'rendering',
                page: rendering
            },
            {
                name: 'facility',
                page: facility
            },
            {
                name: 'network',
                children: [
                    {
                        name: 'request',
                        page: request
                    },
                    {
                        name: 'downloadFile',
                        page: downloadFile
                    },
                    {
                        name: 'uploadFile',
                        page: uploadFile
                    },
                    {
                        name: 'WebSocket',
                        page: WebSocket
                    }
                ]
            },
            {
                name: 'media',
                children: [
                    {
                        name: 'voiceFrequency',
                        page: voiceFrequency
                    },
                    {
                        name: 'video',
                        page: video
                    }
                ]
            },
            {
                name: 'fileSystemManager',
                page: fileSystemManager
            },

            {
                name: 'worker',
                page: worker
            }
        ]
    }
];

function router(PIXI, app, parameter) {
    let treePage = {};
    function regroup(arr, parent) {
        for (var i = 0, len = arr.length; i < len; i++) {
            parameter = { ...parameter };
            parameter.name = arr[i].name;
            if (parent) {
                parameter.parent = true;
            } else {
                parameter.parent && delete parameter.parent;
            }
            arr[i].page &&
                (treePage[[arr[i].name]] = {
                    page: arr[i].page(PIXI, app, parameter)
                });
            if ((arr[i].children || []).length) {
                regroup(arr[i].children, true);
            }
        }
    }
    regroup(signIn);

    window.router = new (function() {
        this.treeView = [
            {
                name: 'APIentry'
            }
        ];
        this.to = function(newPage) {
            let lastOne = this.treeView.length - 1;
            if (this.treeView[lastOne].name === newPage) return;
            treePage[this.treeView[lastOne].name].page.visible = false;
            treePage[newPage].page.visible = true;
            this.treeView.push({
                name: newPage
            });
        };
        this.goBack = function() {
            treePage[this.treeView.pop().name].page.visible = false;
            treePage[this.treeView[this.treeView.length - 1].name].page.visible = true;
        };
    })();
}
module.exports = router;
