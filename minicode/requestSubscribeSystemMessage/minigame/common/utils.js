import { DeviceOrientation } from './const';
/**
 * 暂存安全区域坐标
 */
let cacheSafeArea = null;
/**
 * 获取小游戏真实的安全绘制坐标
 */
export function getSafeArea(systemInfo, useCache = false) {
    if (useCache && cacheSafeArea) {
        return cacheSafeArea;
    }
    let { safeArea } = systemInfo;
    const { deviceOrientation, screenWidth, screenHeight } = systemInfo;
    // 此处有一个坑，部分安卓不一定返回safeArea
    if (!safeArea) {
        safeArea = {
            top: 0,
            left: 0,
            right: screenWidth || 0,
            bottom: screenHeight || 0,
            width: screenWidth || 0,
            height: screenHeight || 0,
        };
    }
    let { left, top, right, bottom, width, height } = safeArea;
    // 此处又是一个坑，虽然实际为横屏，但是返回的deviceOrientation为竖屏时，返回的safeArea依然是竖屏状态下的，left和top需调换
    if (screenWidth && screenHeight && screenWidth > screenHeight) {
        if (deviceOrientation === DeviceOrientation.portrait || width < height) {
            left = safeArea.top;
            top = safeArea.left;
            right = safeArea.bottom;
            bottom = safeArea.right;
            width = safeArea.height;
            height = safeArea.width;
        }
        else if (width === screenHeight && width > height) {
            // 此处又是一个坑，HUAWEI P20在横屏小游戏开播时，获取的safeArea宽度是360，高度是331，导致根本进不去上面其他机型的兼容判断逻辑，所以又新增一个兼容逻辑
            top = 0;
            left = 0;
            right = screenWidth;
            bottom = screenHeight;
            width = screenWidth;
            height = screenHeight;
        }
    }
    cacheSafeArea = {
        left,
        top,
        right,
        bottom,
        width,
        height,
    };
    return cacheSafeArea;
}
