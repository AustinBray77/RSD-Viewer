import { ButtonLabel, DialogButton } from "../Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Services/ClearToolbar";
import { invoke } from "@tauri-apps/api";
import { AppState } from "../App";
import { DropdownFromList } from "../Home/CommonElements";
import { useState } from "react";

function VerifyNumber(phoneNumber: string, ToolbarState: ToolbarState, AppState: AppState): void {
	invoke("send_2FA_code", { phoneNumber: phoneNumber })
		.then((res) => {
			ToolbarState.tfaCode.Set(res as string);
			ToolbarState.showDialog.Set(ShowDialog.Verify2FA);
		})
		.catch((err) => {
			ToolbarState.tfaCode.Set("");
			ToolbarState.phoneNumber.Set("");
			ToolbarState.showDialog.Set(ShowDialog.None);
			AppState.error.Set(err);
		});
}

function AddPhoneNumberDialog(props: {
	ToolbarState: ToolbarState
	AppState: AppState
}): JSX.Element {
	const {
		showDialog,
		phoneNumber
	} = props.ToolbarState

	const [countryCode, setCountryCode] = useState("+1");

	const countryCodes = ["+61", "+1", "+64", "+27", "+44", "+1", "NA"];
	const countryIcons = ["aus.jpg", "canada.jpg", "nzl.jpg", "saf.jpg", "uk.png", "usa.png", "..."];

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
					if (phoneNumber.Value == "") return;

					if (countryCode != "NA") {
						phoneNumber.Set(countryCode + phoneNumber.Value);
						VerifyNumber(phoneNumber.Value, props.ToolbarState, props.AppState);
					} else {
						VerifyNumber(phoneNumber.Value, props.ToolbarState, props.AppState);
					
					}
				}}
			>
				<ButtonLabel>Add</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default AddPhoneNumberDialog