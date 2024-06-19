import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { AppState } from "../App";
import { DropdownFromList } from "../Common/CommonElements";
import { useState } from "react";
import { Get2FACode } from "../Services/TwoFactorAuth";
import { DialogInput } from "../Common/Inputs";

function AddPhoneNumberDialog(props: {
	ToolbarState: ToolbarState
	AppState: AppState
}): JSX.Element {
	const {
		showDialog,
		phoneNumber,
		tfaCode
	} = props.ToolbarState

	const [countryCode, setCountryCode] = useState("+1");
	const countryCodes = ["+61", "+1", "+64", "+27", "+44", "+1", "NA"];
	const countryIcons = ["aus.jpg", "canada.jpg", "nzl.jpg", "saf.jpg", "uk.png", "usa.png", "..."];

	const ClearUsedValues = () => {
		tfaCode.Set("");
		phoneNumber.Set("");
		showDialog.Set(ShowDialog.None);
	}

	const TryAddInputtedPhoneNumber = () => {
		if (phoneNumber.Value == "") return;
		
		let updatedNumber = countryCode != 'NA' ? countryCode + phoneNumber.Value : phoneNumber.Value;

		Get2FACode(updatedNumber, props.AppState.isLoading)
			.then((res: string) => {
				phoneNumber.Set(updatedNumber);
				tfaCode.Set(res);
				showDialog.Set(ShowDialog.Verify2FA);
			})
			.catch((err: any) => {
				ClearUsedValues();
				props.AppState.error.Set("2FA Error: " + err as string);
			})
	}

	return (
		<ToolbarDialog
			dialogTag={ShowDialog.AddPhoneNumber}
			showDialog={showDialog}
			title={"Enter Your Phone Number"}
			onClose={() => { ClearUsedValues() }}
		>
			<div id="input-group" className="px-10 my-5">
				<label className="text-xl">Phone Number: </label>
				<br />
				<div className="flex items-start">
					<DropdownFromList 
						items={countryCodes} 
						icons={countryIcons} 
						startingIndex={1} 
						onChange={(index: number) => { setCountryCode(countryCodes[index]); }} 
						className="w-20 mr-4"
					/>
					<DialogInput value={phoneNumber} required={true} />
				</div>
			</div>
			<DialogButton
				className={phoneNumber.Value == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={TryAddInputtedPhoneNumber}
			>
				<ButtonLabel>Add</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default AddPhoneNumberDialog