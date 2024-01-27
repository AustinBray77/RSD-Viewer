import { ShowDialog, ToolbarState } from "./Toolbar";
import { DialogButton, DialogLabel } from "../Components/Buttons";
import BasicDialog from "../Components/Dialogs";
import { AppState } from "../App";
import { AccountData, AddAccountHandler } from "../Utils/AccountData";
import { ClearToolbar } from "../Utils/Functions";
import { Input, InputGroup } from "../Components/Forms";

function AddAccountDialog(props: {
	ToolbarState: ToolbarState,
    AppState: AppState
}): JSX.Element {
	const {
		showDialog,
		account
	} = props.ToolbarState;

	return (
		<BasicDialog
			open={showDialog.Value == ShowDialog.AddAccount}
			onClose={() => {
				ClearToolbar(props.ToolbarState);
				showDialog.Set(ShowDialog.None)
			}}
			title={"Add an Account"}
		>
			<InputGroup>
				<Input 
					type="text"
					onChange={(e) => {
						account.Set(new AccountData(e.target.value, account.Value.Password))
					}}
					title="Account Name: "
					requirement={account.Value.Name != ""}
				/>
				<Input 
					type="password"
					onChange={(e) => {
						account.Set(new AccountData(account.Value.Name, e.target.value));
					}}
					title="Password: "
					requirement={account.Value.Password != ""}
				/>
			</InputGroup>
			<DialogButton
				enabled={!account.Value.isEmpty()}
				onClick={
					() => { 
						AddAccountHandler(props.ToolbarState, props.AppState);
						ClearToolbar(props.ToolbarState);
						showDialog.Set(ShowDialog.None) 
					}}
			>
				<DialogLabel>Add</DialogLabel>
			</DialogButton>
		</BasicDialog>
	);
}

export default AddAccountDialog