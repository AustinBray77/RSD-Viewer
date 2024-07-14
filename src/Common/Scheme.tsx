type Border = {
    color: string;
    focColor: string;
    hovColor: string;
    thickness: string;
};

type ColorScheme = {
    background: string;
    text: string;
    border: Border;
    hidden?: string;
};

function generateBorder(border: Border) {
    return `${border.thickness} ${border.color} ${border.focColor} ${border.hovColor}`;
}

function generateScheme(scheme: ColorScheme): string {
    return `${scheme.background} ${scheme.text} ${generateBorder(
        scheme.border
    )}`;
}

export { ColorScheme, generateScheme, Border, generateBorder };
