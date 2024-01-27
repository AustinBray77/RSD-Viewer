import { ShowDialog, ToolbarState } from "./Toolbar";
import { DialogButton, DialogLabel } from "../Components/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { AppState } from "../App";
import { AccountData, AddAccountHandler } from "../Services/AccountData";
import { ClearToolbar } from "../Services/ClearToolbar";
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
		<ToolbarDialog
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
		</ToolbarDialog>
	);
}

export default AddAccountDialog