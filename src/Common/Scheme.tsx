type Border = {
    color: string;
    focColor: string;
    thickness: string;
};

type ColorScheme = {
    background: string;
    text: string;
    border: Border;
    hidden?: string;
};

function generateClasses(scheme: ColorScheme): string {
    return `bg-${scheme.background} ${scheme.text} border-${scheme.border.color} focus:border-${scheme.border.focColor} hover:border-${scheme.border.focColor}/[.50] border-${scheme.border.thickness}`;
}

export { ColorScheme, generateClasses };
