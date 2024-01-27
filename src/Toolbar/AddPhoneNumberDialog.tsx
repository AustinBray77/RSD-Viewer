import { DialogButton, DialogLabel } from "../Components/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Services/ClearToolbar";
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
		<ToolbarDialog
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
		</ToolbarDialog>
	);
}

export default AddPhoneNumberDialog