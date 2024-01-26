import { DialogButton } from "../Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Services/ClearToolbar";

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
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Phone Number: </label>
					<input
						type="text"
						onChange={(e) => {
							phoneNumber.Set(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(phoneNumber.Value == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							phoneNumber.Value == "" ? "text-slate-500" : "text-slate-700"
						}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={
					phoneNumber.Value == "" ? " cursor-not-allowed opacity-50" : ""
				}
				onClick={() => {
					props.VerifyNumber(phoneNumber.Value);
				}}
			>
				<div className="text-slate-100 text-xl py-2 px-7">Add</div>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default AddPhoneNumberDialog