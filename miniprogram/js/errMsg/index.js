module.exports = {
    "fail no such file or directory": (obj, apiName, tips) => {
        switch (apiName) {
            case "access":
                obj.callback(`错误：文件/目录不存在，请去添加目录或文件`);
                break;
            case "saveFile":
                obj.callback(`错误：上级目录不存在，请去添加目录`);
                break;
            case "rmdir":
                obj.callback(`错误：目录不存在`);
                break;
            case "unlink":
            case "appendFile":
                obj.callback(`错误：指定的 ${obj.path} 文件路径不存在，请去${tips}文件`);
                break;
            case "copyFile":
            case "rename":
            case "unzip":
                obj.callback(`错误：源文件不存在，或目标文件路径的上层目录不存在请去创建`);
                break;
            default:
                obj.callback(`错误：指定的 ${obj.path} 所在目录不存在，请去添加目录`);
        }
    },
    "fail permission denied": (obj, apiName) => {
        switch (apiName) {
            case "readFile":
                obj.callback(`错误：指定的 ${obj.path} 路径没有读权限`);
                break;
            default:
                obj.callback(`错误：指定的 ${obj.path} 路径没有写权限`);
        }

    },
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