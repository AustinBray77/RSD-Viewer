import { GeneralDialog } from "../Common/Dialogs";
import { StatePair } from "../StatePair";
import { ShowHomeDialog } from "./Home";

function HomeDialog(props: {
    onClose?: (e: {}, r: "backdropClick" | "escapeKeyDown") => void;
	children?: JSX.Element | JSX.Element[];
	title?: string;
    dialogTag: ShowHomeDialog;
    showDialog: StatePair<ShowHomeDialog>;

}): JSX.Element {
    return <GeneralDialog 
        open={props.dialogTag == props.showDialog.Value} 
        title={props.title} 
        onClose={(e: {}, r: "backdropClick" | "escapeKeyDown") => {
            if(props.onClose != undefined) props.onClose!(e, r); 
            props.showDialog.Set(ShowHomeDialog.None)
        }}
        >
            {props.children}
        </GeneralDialog>
}

export default HomeDialog;