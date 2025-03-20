let data = {
    top: 281,
    left: 16,
    width: 342,
    height: 215,
};
export default function getStyle() {
    return {
        container: {
            top: data.top,
            left: data.left,
            width: data.width,
            height: data.height,
        },
        rankList: {
            width: data.width,
            height: data.height,
        },
        list: {
            width: data.width,
            height: data.height,
        },
        listItem: {
            position: 'relative',
            width: data.width,
            height: 67,
            flexDirection: 'row',
            alignItems: 'center',
        },
        rankAvatar: {
            borderRadius: data.width * 0.06,
            marginLeft: data.width * 0.08 + (data.height / 2 / 3) * 0.1,
            width: (data.height / 2 / 3) * 0.6,
            height: (data.height / 2 / 3) * 0.6,
        },
        rankName: {
            position: 'absolute',
            top: (data.height / 2 / 3) * 0.14,
            left: 0,
            width: data.width * 0.35,
            height: (data.height / 2 / 3) * 0.4,
            textAlign: 'center',
            lineHeight: (data.height / 2 / 3) * 0.4,
            fontSize: data.width * 0.043,
            textOverflow: 'ellipsis',
            color: '#fff',
        },
    };
}
