import React from "react";

//type ButtonProps = React.ComponentProps<typeof HTMLButtonElement>;
type ButtonProps = {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	children?: string | JSX.Element | JSX.Element[];
};

function DialogButton(props: ButtonProps): JSX.Element {
	return (
		<button
			className={
				"transition-all duration-300 mx-10 bg-slate-600 hover:bg-slate-800 rounded border-slate-900 " +
				props.className
			}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}

function OptionsButton(props: ButtonProps): JSX.Element {
	return (
		<button
			className={
				"transition-all duration-300 border-2 border-slate-700 bg-slate-600 rounded mx-3 p-3 hover:bg-slate-800 " +
				props.className
			}
			onClick={props.onClick}
		>
			{props.children}
		</button>
	);
}

function ButtonLabel(
	props: { children: string }
): JSX.Element {
	return (
		<div className="text-slate-100 text-xl py-2 px-7">
			{props.children}
		</div>
	);
}

export { DialogButton, ButtonLabel, OptionsButton };
