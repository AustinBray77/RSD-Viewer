import { ShowDialog, ToolbarState } from "./Toolbar";
import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { AppState } from "../App";
import { AccountData, AddAccountHandler } from "../Services/AccountData";
import { useStatePair } from "../StatePair";
import { DialogInput } from "../Common/Inputs";

function AddAccountDialog(props: {
	ToolbarState: ToolbarState,
    AppState: AppState
}): JSX.Element {
	const {
		showDialog
	} = props.ToolbarState;

	const inputName = useStatePair("");
	const inputPassword = useStatePair("");

	return (
		<ToolbarDialog
			dialogTag={ShowDialog.AddAccount}
			showDialog={showDialog}
			onClose={() => {
				inputName.Set("");
				inputPassword.Set("");
			}}
			title={"Add an Account"}
		>
			<div id="input-group" className="px-10">
				<DialogInput label="Account Name: " value={inputName} required={true} className="my-5" />
				<DialogInput label="Password: " value={inputPassword} required={true} className="my-5" type="password" />
			</div>
			<DialogButton
				className={
					inputName.Value == "" || inputPassword.Value == ""
						? " cursor-not-allowed opacity-50"
						: ""
				}
				onClick={
					() => { 
						if(inputName.Value == "" || inputPassword.Value == "") return;

						AddAccountHandler(new AccountData(inputName.Value, inputPassword.Value), props.AppState);

						inputName.Set("");
						inputPassword.Set("");
						showDialog.Set(ShowDialog.None);
					}}
			>
				<ButtonLabel>Add</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default AddAccountDialog