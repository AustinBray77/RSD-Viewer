import { ButtonLabel, DialogButton } from "../Buttons";
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
            open={showDialog.Value == ShowDialog.ImportFile}
            //title="Choose Import Type"
            onClose={() => {
                showDialog.Set(ShowDialog.None);
            }}
        >
            <div className="flex">
                <DialogButton 
                    onClick={() => {
					    props.importCallback(false);
				    }}
                >
                    <ButtonLabel> Non-Legacy Import</ButtonLabel>
                </DialogButton>
                <DialogButton 
                    onClick={() => {
					    props.importCallback(true);
				    }}
                >
                    <ButtonLabel>Legacy Import</ButtonLabel>
                </DialogButton>
            </div>
        </ToolbarDialog>
        );
}

export default ImportFileDialog;