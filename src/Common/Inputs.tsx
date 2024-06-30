import { StatePair } from "../StatePair";

function DialogInput(props: {
    label?: string;
    value: StatePair<string>;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    bounds?: [[boolean, string]];
    required?: boolean;
}): JSX.Element {
    const type = props.type == undefined ? "text" : props.type;

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
        <div className={props.className}>
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
                    "transition-border duration-500 ease-in-out outline-none bg-slate-700 border-2 rounded h-7 " +
                    (isViolating
                        ? "border-rose-500"
                        : "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
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

export { DialogInput };
