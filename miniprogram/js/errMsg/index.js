module.exports = {
    errMsgGlobal: {
        'fail file already exists': obj => {
            obj.callback(`错误：存在同名文件或目录`);
        },
        'fail tempFilePath file not exist': obj => {
            obj.callback(`错误：指定的 tempFilePath 找不到文件`);
        },
        'fail exceeded the maximum size of the file storage limit 50M': obj => {
            obj.callback(`错误：超过文件存储限制的最大大小50M`);
        },
        'fail directory not empty': obj => {
            obj.callback(`错误：目录不为空`);
        },
        ERR_PARENT_DIR_NOT_EXISTS: obj => {
            obj.callback(`错误：文件所在目录不存在请去添加目录`);
        },
        MEDIA_ERR_NETWORK: obj => {
            obj.callback(`当下载时发生错误`);
        },
        MEDIA_ERR_DECODE: obj => {
            obj.callback(`解码错误`);
        },
        MEDIA_ERR_SRC_NOT_SUPPORTED: obj => {
            obj.callback(`video 的 src 属性是不支持的资源类型`);
        }
    },
    gameAdError: {
        1000: '后端错误调用失败：该项错误不是开发者的异常情况',
        1001: '参数错误',
        1002: '推荐位id无效：可能是拼写错误、或者误用了其他小游戏的推荐位id',
        1004: '无适合的推荐：推荐不是每一次都会出现，这次没有出现可能是由于该用户不适合浏览推荐',
        1008: '推荐位已关闭：该推荐位的推荐能力已经被关闭',
        1009: '推荐位id类型错误: 可能复制了其他类型的推荐位id'
    }
};
