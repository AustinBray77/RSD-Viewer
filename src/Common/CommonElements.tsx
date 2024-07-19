import { useMemo, useState } from "react";
import { EstimateTextWidth, useMousePosition } from "../Services/WindowData";
import { Border, ColorScheme, generateBorder, generateScheme } from "./Scheme";

function StandardHomeBox(props: {
    children: JSX.Element[] | JSX.Element | string;
    className?: string;
}): JSX.Element {
    return (
        <div
            className={
                "border-2 border-slate-600/[.1] py-3 content-center " +
                props.className
            }
        >
            {props.children}
        </div>
    );
}

function SmallIcon(props: {
    src: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
}): JSX.Element {
    return (
        <img
            src={props.src}
            className={"w-4 h-3 " + props.className}
            onClick={props.onClick}
        />
    );
}

function Title(props: { children: string; className?: string }): JSX.Element {
    return (
        <StandardHomeBox>
            <h3 className={"flex justify-center text-2xl " + props.className}>
                {props.children}
            </h3>
        </StandardHomeBox>
    );
}

function ToolTip(props: {
    children: string;
    offset?: [number, number];
}): JSX.Element {
    const mousePos = useMousePosition();

    //console.log("Width %d, Height %d", width, height);
    //console.log("Mouse Pos: %d, %d", mousePos.Value.x, mousePos.Value.y);

    const translationString =
        "translate(" +
        (mousePos.Value.x - props.offset![0] + 10) +
        "px," +
        (mousePos.Value.y - props.offset![1] + 30) +
        "px)";

    return (
        <label
            className="fixed z-50 bg-slate-700 z-10 border-2 rounded border-slate-800/[0.50] px-1 py-1"
            style={{ transform: translationString, zIndex: 1000 }}
        >
            {props.children}
        </label>
    );
}

function RetractArrow(props: {
    className?: string;
    subClassName?: string;
    onClick: () => void;
}): JSX.Element {
    return (
        <div
            className={
                "fixed bg-slate-700 py-2 px-3 rounded-b " + props.className
            }
            onClick={props.onClick}
        >
            <img
                className={"w-4 h-3 " + props.subClassName}
                src="/arrow-down-light.png"
            />
        </div>
    );
}

export { StandardHomeBox, Title, ToolTip, RetractArrow, SmallIcon };
