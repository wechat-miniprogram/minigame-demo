export default function getStyle(data: {
  left: number,
  top: number,
  width: number,
  height: number,
  scale: number,
}) {
  const { left, top, width, height, scale } = data;
  function r(value: number) {
    return value * scale;
  }
  return {
    container: {
      top: r(top),
      left: r(left),
      width: r(width),
      height: r(height),
    },

    rankList: {
      width: r(width),
      height: r(height),
    },

    list: {
      width: r(width),
      height: r(height),
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    listItem: {
      position: 'relative',
      width: r(width),
      height: r(67),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },

    rankAvatar: {
      position: 'relative',
      marginLeft: r(10),
      width: r(52),
      height: r(52),
    },

    rankName: {
      position: 'relative',
      verticalAlign: 'middle',
      marginLeft: r(10),
      width: r(220),
      fontSize: r(17),
      textOverflow: 'ellipsis',
      color: '#000000',
    },

    countText: {
      position: 'relative',
      verticalAlign: 'middle',
      marginLeft: r(10),
      fontSize: r(17),
      textOverflow: 'ellipsis',
      color: '#000000',
    },

    participantTips: {
      position: 'relative',
      marginTop: r(16),
      height: r(20),
      verticalAlign: 'middle',
      fontSize: r(14),
      textOverflow: 'ellipsis',
      color: '#000000',
      opacity: 0.3,
    },
  };
}
