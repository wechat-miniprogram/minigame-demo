module.exports = function(time, fmt) {
    var o = {
        'M+': time.getMonth() + 1, //月份
        'd+': time.getDate(), //日
        'h+': time.getHours(), //小时
        'm+': time.getMinutes(), //分
        's+': time.getSeconds(), //秒
        'q+': Math.floor((time.getMonth() + 3) / 3), //季度
        S: time.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (let i = 0, arr = Object.keys(o), len = arr.length; i < len; i++) {
        if (new RegExp('(' + arr[i] + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[arr[i]] : ('00' + o[arr[i]]).substr(('' + o[arr[i]]).length)
            );
        }
    }

    return fmt;
};
