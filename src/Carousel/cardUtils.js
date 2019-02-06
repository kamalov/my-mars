const cardsMargins = [
    {
        horizontal: 16,
        top: 48,
        bottom: 52
    },
    {
        horizontal: 32,
        top: 32,
        bottom: 86
    },
    {
        horizontal: 48,
        top: 16,
        bottom: 100
    },
];

export function getCardLayout(componentSize, cardIndex) {
    const {width, height} = componentSize;
    const margins = cardsMargins[cardIndex];
    return {
        left: margins.horizontal,
        top: margins.top,
        width: width - margins.horizontal * 2,
        height: height - margins.top - margins.bottom
    };
}

export function getCardTransformParams(componentSize, cardIndex) {
    const topCardLayout = getCardLayout(componentSize, 0);
    const layout = getCardLayout(componentSize, cardIndex);

    const scaleY = layout.height / topCardLayout.height;
    const shift = (topCardLayout.height - layout.height) / 2;
    const translateY = (shift + topCardLayout.top - layout.top) / scaleY;

    return {
        scaleX: layout.width / topCardLayout.width,
        scaleY,
        translateY
    };
}
