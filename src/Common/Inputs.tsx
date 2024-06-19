import { StatePair } from "../StatePair";

function DialogInput(props: { label?: string, value: StatePair<string>, className?: string, required?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }): JSX.Element {
    const type = props.type == undefined ? "text" : props.type; 
    
    return <div className={props.className}>
        { props.label != undefined ? <label className="text-xl">{props.label}</label> : <></>} 
        <input
            type={type}
            onChange={ props.onChange != undefined ? props.onChange : 
                (e) => {
                    props.value.Set(e.target.value);
                }
            }
            className={
                "transition-border duration-500 ease-in-out outline-none bg-slate-700 border-2 rounded h-7 " +
                (props.value.Value == "" && props.required
                    ? "border-rose-500"
                    : "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
            }
        />
        <br />
        {   props.required ?
            <label
                className={
                    "transition-opacity duration-500 text-slate-500 " +
                    (props.value.Value == "" ? "opacity-100" : "opacity-0")
                }
            >
                This field is required
            </label> : ""
        }
    </div>
}

export { DialogInput }