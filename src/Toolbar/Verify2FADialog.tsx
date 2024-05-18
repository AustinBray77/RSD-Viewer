import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { AppState } from "../App";
import { useState } from "react";
import { AddPhoneNumber } from "../Services/AccountData";
import { DialogInput } from "../Common/Inputs";
import { useStatePair } from "../StatePair";

function Verify2FADialog(props: {
	ToolbarState: ToolbarState,
	AppState: AppState
}): JSX.Element {
	const {
		showDialog,
		tfaCode,
		phoneNumber
	} = props.ToolbarState;
	
	const testCode = useStatePair("");

	const ClearUsedValues = () => {
		showDialog.Set(ShowDialog.None);
		tfaCode.Set("");
		phoneNumber.Set("");
		testCode.Set("");
	}

	const VerifyInputtedCode = () => {
		if (testCode.Value =="") return;

		if(testCode.Value == tfaCode.Value) {
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
				<DialogInput label="2FA Code: " value={testCode} required={true} className="my-5" />
			</div>
			<DialogButton
				className={testCode.Value == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={VerifyInputtedCode}
			>
				<ButtonLabel>Submit</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default Verify2FADialog