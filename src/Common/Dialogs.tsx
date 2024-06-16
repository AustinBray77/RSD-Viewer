import { Dialog } from "@mui/material";
import { DialogButton } from "./Buttons";
import { AppState } from "../App";

function GeneralDialog(props: {
	open: boolean;
	onClose?: (e : {}, r: "backdropClick" | "escapeKeyDown") => void;
	children?: JSX.Element | JSX.Element[];
	title?: string;
	ref?: React.RefObject<HTMLDivElement>;
}): JSX.Element {
	return (
		<Dialog 
			open={props.open} 
			onClose={props.onClose}
			className="backdrop-blur"
			ref={props.ref}
		>
			<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
				<h2 className="text-3xl px-10 text-slate-100">{props.title}</h2>
				{props.children}
			</div>
		</Dialog>
	);
}

function ErrorDialog(props: {
	onClose: () => void;
	error: String;
}): JSX.Element {
	let shouldOpen: boolean = props.error != "";

	return (
		<Dialog id="Error Dialog" open={shouldOpen} onClose={() => props.onClose()}>
			<div className="p-10 bg-slate-800">
				<h2 className="text-3xl text-slate-100 m-5">{props.error}</h2>
				<DialogButton onClick={() => props.onClose()} className="p-5">
					Ok
				</DialogButton>
			</div>
		</Dialog>
	);
}

function LoadingDialog(props: {state: AppState}) {
	return (
		<Dialog id="Loading Dialog" open={props.state.isLoading.Value}>
			<div className="p-10 bg-slate-800 flex">
				<img src="/loading_icon.png" className="w-10 h-10 animate-spin ease-in-out self-center mx-3" />
				<h2 className="text-3xl text-slate-100 self-center mx-3">Loading...</h2>
			</div>
		</Dialog>
	)
}

export { GeneralDialog, ErrorDialog, LoadingDialog }