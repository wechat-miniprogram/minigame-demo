export default function getStyle(data) {
    const { left, top, width, height, scale, pixelRatio } = data;
    console.warn('data', data);
    function r(value) {
        return value * scale;
    }
    return {
        container: {
            top: r(top * pixelRatio),
            left: r(left * pixelRatio),
            width: r(width * pixelRatio),
            height: r(height * pixelRatio),
        },
        rankList: {
            width: r(width * pixelRatio),
            height: r(height * pixelRatio),
        },
        list: {
            width: r(width * pixelRatio),
            height: r(height * pixelRatio),
        },
        listItem: {
            position: 'relative',
            width: r(width * pixelRatio),
            height: r(67 * pixelRatio),
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
        },
        rankAvatar: {
            position: 'relative',
            marginLeft: r(10 * pixelRatio),
            width: r(52 * pixelRatio),
            height: r(52 * pixelRatio),
        },
        rankName: {
            position: 'relative',
            verticalAlign: 'middle',
            marginLeft: r(10 * pixelRatio),
            width: r(150 * pixelRatio),
            fontSize: r(17 * pixelRatio),
            textOverflow: 'ellipsis',
            color: '#000000',
        },
        countText: {
            position: 'relative',
            verticalAlign: 'middle',
            marginLeft: r(0 * pixelRatio),
            fontSize: r(17 * pixelRatio),
            textOverflow: 'ellipsis',
            color: '#000000',
        },
    };
}
