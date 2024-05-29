import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { invoke } from "@tauri-apps/api";
import { AppState } from "../App";
import { DropdownFromList } from "../Common/CommonElements";
import { useState } from "react";
import { StatePair } from "../StatePair";

function Get2FACode(phoneNumber: string, state: AppState): Promise<string> {
	state.isLoading.Set(true);
	
	return invoke("send_2fa_code", { phoneNumber: phoneNumber })
		.then((res) => {
			state.isLoading.Set(false);
			return res as string;
		})
		.catch((err) => {
			state.isLoading.Set(false);
			throw err;
		});
}

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

		Get2FACode(updatedNumber, props.AppState)
			.then((res: string) => {
				phoneNumber.Set(updatedNumber);
				tfaCode.Set(res);
				showDialog.Set(ShowDialog.Verify2FA);
			})
			.catch((err: any) => {
				ClearUsedValues();
				props.AppState.error.Set(err as string);
			})
	}

	return (
		<ToolbarDialog
			dialogTag={ShowDialog.AddPhoneNumber}
			showDialog={showDialog}
			title={"Enter Your Phone Number"}
			onClose={() => { ClearUsedValues() }}
		>
			<div id="input-group" className="px-10">
				<div className="my-5 col">
					<label className="text-xl">Phone Number: </label>
					<br />
					<div className="flex">
						<DropdownFromList 
							items={countryCodes} 
							icons={countryIcons} 
							startingIndex={1} 
							onChange={(index: number) => { setCountryCode(countryCodes[index]); }} 
							className="w-20"
						/>
						&nbsp;
						<input
							type="text"
							onChange={(e) => {
								phoneNumber.Set(e.target.value);
							}}
							className={
								"focus:outline-none bg-slate-700 border-2 rounded h-8 " +
								(phoneNumber.Value == ""
									? "border-rose-500"
									: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
							}
						/>
					</div>
					<label
						className={phoneNumber.Value == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
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