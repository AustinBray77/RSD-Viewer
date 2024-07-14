import React from "react";
import { useStatePair } from "../StatePair";

const useMousePosition = () => {
    const mousePosition = useStatePair({ x: 0, y: 0 });

    React.useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            mousePosition.Set({ x: ev.clientX, y: ev.clientY });
        };

        window.addEventListener("mousemove", updateMousePosition);

        return () => {
            window.removeEventListener("mousemove", updateMousePosition);
        };
    }, []);

    return mousePosition;
};

function EstimateTextWidth(text: string, format?: string): number {
    format = format ?? "rem";

    switch (format) {
        case "rem":
            return text.length * 0.75;
        default:
            return text.length * 0.75;
    }
}

export { useMousePosition, EstimateTextWidth };
