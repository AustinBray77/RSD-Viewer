import { Dialog } from "@mui/material";
import { DialogButton } from "./Buttons";
import { useState } from "react";

function BasicDialog (props: {
	open: boolean;
	onClose?: (e: {}, r: "backdropClick" | "escapeKeyDown") => void;
	children?: JSX.Element | JSX.Element[];
	title?: string;
}): JSX.Element {
	return (
		<Dialog open={props.open} onClose={props.onClose} className="backdrop-blur">
			<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
				<h2 className="text-3xl px-10 text-slate-100">{props.title}</h2>
				{props.children}
			</div>
		</Dialog>
	);
};

function MessageDialog(props: {
	open: boolean;
	message: string;
	onClose?: (e: {}, r: "backdropClick" | "escapeKeyDown") => void;
}) {
	const [ open, setOpen ] = useState(props.open);

	return (
		<BasicDialog open={open} onClose={() => setOpen(false)} title={props.message}>
			<DialogButton onClick={() => setOpen(false)}>
				Ok
			</DialogButton>
		</BasicDialog>
	)
}

export default BasicDialog