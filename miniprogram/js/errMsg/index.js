module.exports = {
    "fail file already exists": (obj) => {
        obj.callback(`错误：存在同名文件或目录`);
    },
    "fail tempFilePath file not exist": (obj) => {
        obj.callback(`错误：指定的 tempFilePath 找不到文件`);
    },
    "fail exceeded the maximum size of the file storage limit 50M": (obj) => {
        obj.callback(`错误：超过文件存储限制的最大大小50M`);
    },
    "fail directory not empty": (obj) => {
        obj.callback(`错误：目录不为空`);
    },
    "ERR_PARENT_DIR_NOT_EXISTS":  (obj) => {
        obj.callback(`错误：文件所在目录不存在请去添加目录`);
    },
    "MEDIA_ERR_NETWORK":  (obj) => {
        obj.callback(`当下载时发生错误`);
    },
    "MEDIA_ERR_DECODE":  (obj) => {
        obj.callback(`解码错误`);
    },
    "MEDIA_ERR_SRC_NOT_SUPPORTED":  (obj) => {
        obj.callback(`video 的 src 属性是不支持的资源类型`);
    },
};