import { title } from 'process'
import React, { ChangeEventHandler } from 'react'

function InputGroup (props: { children: JSX.Element | JSX.Element[] }) {
    return (
        <div id="input-group" className="px-10">
            {props.children}
        </div>
    )
}

function Input (props: { 
    type: string
    onChange: React.ChangeEventHandler<HTMLInputElement>
    title?: string
    requirement?: boolean
}) {
    const {
        onChange,
        type,
        title,
        requirement
    } = props;
    
    return (
        <div className="my-5">
		    { title != undefined ? <label className="text-xl">{title}</label> : "" }
			<input
				type={type}
				onChange={onChange}
				className={
					"focus:outline-none bg-slate-700 border-2 rounded " +
					(requirement != undefined && !requirement
						? "border-rose-500"
						: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
				}
			/>
			<br />
			
            {   requirement != undefined ?
                <label
			    	className={
			    		!requirement ? "text-slate-500" : "text-slate-700"
			    	}
			    >
			    	This field is required
			    </label>
                : ""
            }
		</div>
    )
}

type CheckBoxProps = {
    label: string,
    onClick: React.MouseEventHandler<HTMLInputElement>,
    checked?: boolean
}

function CheckBox(props: CheckBoxProps): JSX.Element {
    return <>
            <input
                className="inline-flex px-3"
                type="checkbox"
                title={props.label}
                onClick={props.onClick}
                checked={props.checked!}
            />
            <label className="mx-2">{props.label}</label>
        </>
}

function CheckBoxRow(props: {
    title?: string
    length: number
    checkBoxProps: CheckBoxProps[]
}): JSX.Element {
    const {
        title,
        length,
        checkBoxProps
    } = props
    
    let boxes: JSX.Element[] = [];

    console.log(length)

    for(let i = 0; i < length; i++) {

        boxes.push(<CheckBox label={checkBoxProps[i].label} onClick={checkBoxProps[i].onClick} checked={checkBoxProps[i].checked} />);
    }

    return <div className="my-5">
		    { title != undefined ? <label className="text-xl">{title}</label> : "" }
			<div>
                {boxes}
            </div>
		</div>
}

function Slider(props: {
    title?: string
    min: number
    max: number
    value?: number
    onChange?: ChangeEventHandler<HTMLInputElement>
}) {
    const {
        title,
        min,
        max,
        value,
        onChange
    } = props;

    return <div className="my-5">
        { title != undefined ? <label className="text-xl">{title}</label> : "" }
        <div>
            <label className="align-middle mx-3">{min}</label>
            <input
                type="range"
                min={min}
                max={max}
                value={value!}
                className="slider inline-flex align-middle"
                onChange={onChange!}
            />
            <label className="align-middle mx-3">{max}</label>
        </div>
    </div>
}

export { InputGroup, Input, CheckBox, CheckBoxRow, CheckBoxProps, Slider }