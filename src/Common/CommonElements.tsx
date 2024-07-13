import { useState } from "react";
import useMousePosition from "../Services/WindowData";
import { ColorScheme, generateScheme } from "./Scheme";

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

const DropdownLight: DropdownScheme = {
    buttonScheme: {
        background: "bg-slate-700",
        text: "",
        border: {
            color: "border-slate-700",
            focColor: "focus:border-slate-600",
            hovColor: "hover:border-slate-600/[.50]",
            thickness: "border-2",
        },
    },
    dropdownScheme: {
        background: "bg-slate-700",
        text: "",
        border: {
            color: "border-slate-800/[.50]",
            focColor: "focus:border-slate-600",
            hovColor: "hover:border-slate-600/[.50]",
            thickness: "border-2",
        },
        hidden: "border-slate-700",
    },
};

const DropdownDark: DropdownScheme = {
    buttonScheme: {
        background: "bg-slate-900",
        text: "",
        border: {
            color: "border-slate-600",
            focColor: "focus:border-slate-600",
            hovColor: "hover:border-slate-600/[.50]",
            thickness: "border-2",
        },
    },
    dropdownScheme: {
        background: "border-slate-900",
        text: "",
        border: {
            color: "border-slate-800/[.50]",
            focColor: "focus:border-slate-600",
            thickness: "border-2",
            hovColor: "hover:border-slate-600/[.50]",
        },
        hidden: "border-slate-900",
    },
};

type DropdownScheme = {
    buttonScheme: ColorScheme;
    dropdownScheme: ColorScheme;
};

function DropdownFromList(props: {
    items: string[];
    icons?: string[];
    startingIndex: number;
    onChange: (index: number) => void;
    className: string;
    scheme?: DropdownScheme;
}): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(props.startingIndex);

    const scheme = props.scheme == undefined ? DropdownLight : props.scheme;

    function getDropdownFromItem(
        item: string,
        icon: string | undefined,
        index: number,
        onClick: (index: number) => void,
        needsSpacing: boolean,
        style: string
    ): JSX.Element {
        return (
            <div
                onClick={() => {
                    onClick(index);
                }}
                className={"flex items-center " + style}
            >
                {needsSpacing ? <div className="w-4 h-3"></div> : ""}
                {icon == undefined ? <></> : <SmallIcon src={icon} />}
                &nbsp;
                <div>{item}</div>
            </div>
        );
    }

    function generateDropdown(): JSX.Element[] {
        let dropdownItems: JSX.Element[] = [];

        for (let i = 0; i < props.items.length; i++) {
            dropdownItems.push(
                getDropdownFromItem(
                    props.items[i],
                    props.icons == undefined ? undefined : props.icons[i],
                    i,
                    (index: number) => {
                        if (!isOpen) return;

                        setCurrentIndex(index);
                        setIsOpen(false);
                        props.onChange(index);
                    },
                    true,
                    `rounded border-2 ${scheme.dropdownScheme.background} hover:border-slate-600/[.50] focus:border-slate-600 ${scheme.dropdownScheme.background}`
                )
            );
        }

        return dropdownItems;
    }

    let animationString = isOpen
        ? `h-20 ${scheme.dropdownScheme.border.color}`
        : `h-0 ${
              scheme.dropdownScheme.hidden ?? scheme.dropdownScheme.border.color
          }`;

    return (
        <div className={props.className}>
            <div
                className={
                    "flex h-7 focus:outline-none rounded items-center " +
                    generateScheme(scheme.buttonScheme)
                }
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
            >
                &nbsp;
                <img className="w-3 h-3" src="/arrow-down-light.png" />
                &nbsp;
                {getDropdownFromItem(
                    props.items[currentIndex],
                    props.icons == undefined
                        ? undefined
                        : props.icons[currentIndex],
                    currentIndex,
                    (_: number) => {},
                    false,
                    ""
                )}
                &nbsp;
            </div>
            <div
                className={
                    `transition-all duration-500 overflow-y-auto fixed ${scheme.dropdownScheme.background} z-10 rounded ${scheme.dropdownScheme.border.thickness} drop-down-scroll ` +
                    animationString
                }
            >
                {generateDropdown()}
            </div>
        </div>
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

export {
    StandardHomeBox,
    DropdownFromList,
    DropdownDark,
    DropdownLight,
    Title,
    ToolTip,
    RetractArrow,
    SmallIcon,
};
