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
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tips: {
            color: '#a9a9a9',
            fontSize: r(16),
            textAlign: 'center',
            verticalAlign: 'middle',
        },
    };
}
