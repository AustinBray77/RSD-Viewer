import { StatePair } from "../StatePair";

function DialogInput(props: { label: string, value: StatePair<string>, className?: string, required?: boolean, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string }): JSX.Element {
    const type = props.type == undefined ? "text" : props.type; 
    
    return <div className={props.className}>
        <label className="text-xl">{props.label}</label>
        <input
            type={type}
            onChange={ props.onChange != undefined ? props.onChange : 
                (e) => {
                    props.value.Set(e.target.value);
                }
            }
            className={
                "focus:outline-none bg-slate-700 border-2 rounded " +
                (props.value.Value == "" && props.required
                    ? "border-rose-500"
                    : "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
            }
        />
        <br />
        {   props.required ?
            <label
                className={
                    props.value.Value == "" ? "text-slate-500" : "text-slate-700"
                }
            >
                This field is required
            </label> : ""
        }
    </div>
}

export { DialogInput }