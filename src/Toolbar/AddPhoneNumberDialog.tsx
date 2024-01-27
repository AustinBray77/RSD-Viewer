import { DialogButton, DialogLabel } from "../Components/Buttons";
import BasicDialog from "../Components/Dialogs";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Utils/Functions";
import { Input, InputGroup } from "../Components/Forms";

function AddPhoneNumberDialog(props: {
	ToolbarState: ToolbarState
	VerifyNumber: (phoneNumber: string) => void;
}): JSX.Element {
	const {
		showDialog,
		phoneNumber
	} = props.ToolbarState

	return (
		<BasicDialog
			open={showDialog.Value == ShowDialog.AddPhoneNumber}
			onClose={() => {
				ClearToolbar(props.ToolbarState);
				showDialog.Set(ShowDialog.None)
			}}
			title={"Generate A Password"}
		>
			<InputGroup>
				<Input 
					title="Phone Number: "
					type="text"
					onChange={(e) => {
						phoneNumber.Set(e.target.value);
					}}
					requirement={phoneNumber.Value != ""}
				/>
			</InputGroup>
			<DialogButton
				enabled={phoneNumber.Value != ""}
				onClick={() => {
					props.VerifyNumber(phoneNumber.Value);
				}}
			>
				<DialogLabel>Add</DialogLabel>
			</DialogButton>
		</BasicDialog>
	);
}

export default AddPhoneNumberDialog