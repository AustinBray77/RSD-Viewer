import { ButtonLabel, DialogButton } from "../Common/Buttons";
import { ShowDialog, ToolbarState } from "./Toolbar";
import ToolbarDialog from "./ToolbarDialog";

function ImportFileDialog(
    props: { 
        ToolbarState: ToolbarState, 
        importCallback: (isLegacy: boolean) => void
    }
): JSX.Element {
    const {
		showDialog,
	} = props.ToolbarState;

    return (
        <ToolbarDialog 
            dialogTag={ShowDialog.ImportFile}
			showDialog={showDialog}
        >
            <div className="flex">
                <DialogButton 
                    onClick={() => {
					    props.importCallback(false);
				    }}
                    className="w-[15rem]"
                >
                    <ButtonLabel>Non-Legacy Import</ButtonLabel>
                </DialogButton>
                <DialogButton 
                    onClick={() => {
					    props.importCallback(true);
				    }}
                    className="w-[15rem]"
                >
                    <ButtonLabel>Legacy Import</ButtonLabel>
                </DialogButton>
            </div>
        </ToolbarDialog>
        );
}

export default ImportFileDialog;