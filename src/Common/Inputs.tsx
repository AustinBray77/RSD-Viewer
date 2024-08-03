import { useState, useMemo } from "react";
import { EstimateTextWidth } from "../Services/WindowData";
import { StatePair } from "../StatePair";
import { SmallIcon } from "./CommonElements";
import { Border, ColorScheme, generateBorder, generateScheme } from "./Scheme";

const InputLight: ColorScheme = {
    background: "bg-slate-700",
    text: "text-slate-500",
    border: {
        color: "border-slate-700",
        focColor: "focus:border-slate-600",
        hovColor: "hover:border-slate-600/[.50]",
        thickness: "border-2",
    },
};

const InputDark: ColorScheme = {
    background: "bg-slate-900",
    text: "",
    border: {
        color: "border-slate-700/[0.50]",
        focColor: "focus:border-slate-600/[.50]",
        hovColor: "hover:border-slate-600/[.50]",
        thickness: "border-2",
    },
};

function DialogInput(props: {
    label?: string;
    value: StatePair<string>;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    bounds?: [[boolean, string]];
    required?: boolean;
    style?: React.CSSProperties;
    scheme?: ColorScheme;
}): JSX.Element {
    const type = props.type == undefined ? "text" : props.type;
    const scheme = props.scheme ?? InputLight;

    let bounds: [boolean, string][] =
        props.bounds ?? Array<[boolean, string]>(0);

    if (props.required) {
        bounds.unshift([props.value.Value == "", "This field is required"]);
    }

    let [isViolating, message] = bounds.reduce(
        (acc, curr) => {
            if (acc[0]) {
                return acc;
            }

            return curr;
        },
        [false, ""]
    );

    return (
        <div className={props.className} style={props.style ?? {}}>
            {props.label != undefined ? (
                <label className="text-xl">{props.label}</label>
            ) : (
                <></>
            )}
            <input
                type={type}
                onChange={
                    props.onChange != undefined
                        ? props.onChange
                        : (e) => {
                              props.value.Set(e.target.value);
                          }
                }
                className={
                    `transition-border duration-500 ease-in-out outline-none ${scheme.background} rounded h-7 ` +
                    (isViolating
                        ? `border-rose-500 ${scheme.border.thickness}`
                        : generateBorder(scheme.border))
                }
            />
            <br />
            {bounds.length > 0 ? (
                <label
                    className={
                        "transition-opacity duration-500 text-slate-500 " +
                        (isViolating ? "opacity-100" : "opacity-0")
                    }
                >
                    {message}
                </label>
            ) : (
                ""
            )}
        </div>
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
    itemBorders: {
        color: "border-slate-700",
        thickness: "border-2",
        focColor: "focus:border-slate-600",
        hovColor: "hover:border-slate-600",
    },
};

const DropdownDark: DropdownScheme = {
    buttonScheme: {
        background: "bg-slate-900",
        text: "",
        border: {
            color: "border-slate-700/[0.50]",
            focColor: "focus:border-slate-600/[.50]",
            hovColor: "hover:border-slate-600/[.50]",
            thickness: "border-2",
        },
    },
    dropdownScheme: {
        background: "bg-slate-900",
        text: "",
        border: {
            color: "border-slate-800",
            focColor: "focus:border-slate-600",
            thickness: "border-2",
            hovColor: "hover:border-slate-600",
        },
        hidden: "border-slate-900",
    },
    itemBorders: {
        color: "border-slate-900",
        thickness: "border-2",
        focColor: "focus:border-slate-800",
        hovColor: "hover:border-slate-800",
    },
};

type DropdownScheme = {
    buttonScheme: ColorScheme;
    dropdownScheme: ColorScheme;
    itemBorders: Border;
};

function DropdownFromList(props: {
    items: string[];
    icons?: string[];
    startingIndex: number;
    onChange: (index: number) => void;
    className?: string;
    scheme?: DropdownScheme;
    innerRef?: React.RefObject<HTMLDivElement>;
}): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(props.startingIndex);

    const scheme = props.scheme == undefined ? DropdownLight : props.scheme;

    let width = useMemo(() => {
        let itemLengths = props.items.map((item) =>
            EstimateTextWidth(item, "rem")
        );

        let width = Math.max(...itemLengths);

        let paddingOffset = 1;

        width += paddingOffset;

        if (props.icons != undefined) {
            width += 2;
        }

        return width;
    }, [props.items]);

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
                //style={{ width: width + "rem" }}
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
                    "rounded " + generateBorder(scheme.itemBorders)
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
        <div className={"" + props.className} ref={props.innerRef}>
            <div
                className={
                    "flex h-7 focus:outline-none rounded items-center transition-all duration-500 " +
                    generateScheme(scheme.buttonScheme)
                }
                onClick={() => {
                    setIsOpen(!isOpen);
                }}
                style={{ width: width + "rem" }}
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
                    `transition-all duration-500 absolute overflow-y-auto overflow-x-hidden ${scheme.dropdownScheme.background} z-10 rounded ${scheme.dropdownScheme.border.thickness} drop-down-scroll ` +
                    animationString
                }
                style={{ width: width + "rem" }}
            >
                {generateDropdown()}
            </div>
        </div>
    );
}

export {
    DialogInput,
    DropdownFromList,
    DropdownDark,
    DropdownLight,
    InputLight,
    InputDark,
};
