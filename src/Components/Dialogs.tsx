import { Dialog } from "@mui/material";

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

export default BasicDialog