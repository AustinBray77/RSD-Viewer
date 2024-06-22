import { SmallIcon } from "../Common/CommonElements";

export default function RowButtons(props: {
    isHovering: boolean;
}): JSX.Element {
    let opacity = props.isHovering ? "opacity-50" : "opacity-0";
    let classString =
        "self-center transition-opacity duration-300 ease-in-out " + opacity;

    return (
        <div
            className="w-5 min-w-fit p-3 place-content-evenly"
            onClick={() => {}}
        >
            <div className="grid grid-cols-1 grid-rows-2 place-content-evenly h-full">
                <SmallIcon
                    src="/arrow-down-light.png"
                    className={classString + " rotate-180"}
                />
                <SmallIcon
                    src="/arrow-down-light.png"
                    className={classString}
                />
            </div>
        </div>
    );
}
