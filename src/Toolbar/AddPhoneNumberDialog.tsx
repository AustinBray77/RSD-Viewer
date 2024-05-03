import { ButtonLabel, DialogButton } from "../Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Services/ClearToolbar";
import { invoke } from "@tauri-apps/api";
import { AppState } from "../App";

function VerifyNumber(phoneNumber: string, ToolbarState: ToolbarState, AppState: AppState): void {
	invoke("send_code_setup", { phoneNumber: phoneNumber })
		.then((res) => {
			ToolbarState.tfaCode.Set(res as string);
			ToolbarState.showDialog.Set(ShowDialog.Verify2FA);
		})
		.catch((err) => {
			ToolbarState.tfaCode.Set("");
			ToolbarState.showDialog.Set(ShowDialog.None);
			AppState.error.Set(err);
		});

	ToolbarState.phoneNumber.Set("");
}

function AddPhoneNumberDialog(props: {
	ToolbarState: ToolbarState
	AppState: AppState
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
			title={"Enter Your Phone Number"}
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
					VerifyNumber(phoneNumber.Value, props.ToolbarState, props.AppState);
				}}
			>
				<ButtonLabel>Add</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default AddPhoneNumberDialog