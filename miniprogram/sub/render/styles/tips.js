export default function getStyle(data) {
    const { left, top, width, height, scale } = data;
    function r(value) {
        return value * scale;
    }
    return {
        container: {
            left: r(left),
            top: r(top),
            width: r(width),
            height: r(height),
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tips: {
            margin: r(3),
            color: '#a9a9a9',
            fontSize: r(16),
            textAlign: 'center',
            verticalAlign: 'middle',
        },
        subTips: {
            margin: r(5),
            marginTop: r(16),
            color: '#a9a9a9',
            fontSize: r(16),
            textAlign: 'center',
            width: r(width),
            verticalAlign: 'middle',
        },
    };
}
