import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { AppState } from "../App";
import { useState } from "react";
import { AddPhoneNumber } from "../Services/AccountData";

function Verify2FADialog(props: {
	ToolbarState: ToolbarState,
	AppState: AppState
}): JSX.Element {
	const {
		showDialog,
		tfaCode,
		phoneNumber
	} = props.ToolbarState;
	
	const [testCode, setTestCode] = useState("");

	const ClearUsedValues = () => {
		showDialog.Set(ShowDialog.None);
		tfaCode.Set("");
		phoneNumber.Set("");
		setTestCode("");
	}

	const VerifyInputtedCode = () => {
		if (testCode =="") return;

		if(testCode == tfaCode.Value) {
			AddPhoneNumber(phoneNumber.Value, props.AppState);
		} else {
			props.AppState.error.Set("Invalid 2FA code");
		}

		ClearUsedValues();
	}

	return (
		<ToolbarDialog
			dialogTag={ShowDialog.Verify2FA}
			showDialog={showDialog}
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
				onClick={VerifyInputtedCode}
			>
				<ButtonLabel>Submit</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default Verify2FADialog