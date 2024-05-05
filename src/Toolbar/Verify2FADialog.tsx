import { ButtonLabel, DialogButton } from "../Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { AppState } from "../App";
import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import { AccountData, AddPhoneNumber } from "../Services/AccountData";

function VerifyCode (code: string, ToolbarState: ToolbarState, AppState: AppState):void {
	if(code == ToolbarState.tfaCode.Value) {
		AddPhoneNumber(ToolbarState.phoneNumber.Value, AppState);
	} else {
		AppState.error.Set("Invalid 2FA code");
	}

	ToolbarState.showDialog.Set(ShowDialog.None);
	ToolbarState.tfaCode.Set("");
	ToolbarState.phoneNumber.Set("");
}

function Verify2FADialog(props: {
	ToolbarState: ToolbarState,
	AppState: AppState
}): JSX.Element {
	const {
		showDialog
	} = props.ToolbarState;
	
	const [testCode, setTestCode] = useState("");

	return (
		<ToolbarDialog
			open={showDialog.Value == ShowDialog.Verify2FA}
			onClose={() => {
				showDialog.Set(ShowDialog.None)
			}}
			title={"Enter The 2FA Code"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">2FA Code: </label>
					<input
						type="text"
						onChange={(e) => {
							setTestCode(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(testCode == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={testCode == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={testCode == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={() => {
					if (testCode =="") return;

					VerifyCode(testCode, props.ToolbarState, props.AppState);
					setTestCode("");
				}}
			>
				<ButtonLabel>Submit</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default Verify2FADialog