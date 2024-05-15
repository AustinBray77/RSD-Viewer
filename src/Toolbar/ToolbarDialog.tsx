import { Dialog } from "@mui/material";
import { StatePair } from "../StatePair";
import { ShowDialog } from "./Toolbar";
import { GeneralDialog } from "../Common/Dialogs";

const ToolbarDialog = (props: {
	onClose?: (e: {}, r: "backdropClick" | "escapeKeyDown") => void;
	children?: JSX.Element | JSX.Element[];
	title?: string;
	showDialog: StatePair<ShowDialog>;
	dialogTag: ShowDialog;
}): JSX.Element => {
	return (
		<GeneralDialog
			open={props.showDialog.Value == props.dialogTag} 
			onClose={(e : {}, r: "backdropClick" | "escapeKeyDown") => { props.onClose!(e, r); props.showDialog.Set(ShowDialog.None) }} 
			title={props.title}
		>
			{props.children}
		</GeneralDialog>
	);
};

export default ToolbarDialog