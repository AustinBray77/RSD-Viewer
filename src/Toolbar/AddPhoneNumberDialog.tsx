import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { invoke } from "@tauri-apps/api";
import { AppState } from "../App";
import { DropdownFromList } from "../Common/CommonElements";
import { useState } from "react";
import { StatePair } from "../StatePair";

function Get2FACode(phoneNumber: string): Promise<string> {
	invoke("send_2FA_code", { phoneNumber: phoneNumber })
		.then((res) => {
			return res as string;
		})
		.catch((err) => {
			throw err as string;
		});

	return Promise.resolve("This is never reached but required :(");
}

function UpdatePhoneNumberWithCountryCode(countryCode: string, phoneNumber: StatePair<string>): void { 
	if (countryCode != "NA") {
		phoneNumber.Set(countryCode + phoneNumber.Value);
	}
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

		UpdatePhoneNumberWithCountryCode(countryCode, phoneNumber);
					
		Get2FACode(phoneNumber.Value)
			.then((res: string) => {
				tfaCode.Set(res);
				showDialog.Set(ShowDialog.Verify2FA);
			})
			.catch((err: string) => {
				ClearUsedValues();
				props.AppState.error.Set(err);
			})
	}

	return (
		<ToolbarDialog
			dialogTag={ShowDialog.AddPhoneNumber}
			showDialog={showDialog}
			title={"Enter Your Phone Number"}
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
							onChange={(index: number) => { setCountryCode(countryCodes[index]) }} 
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