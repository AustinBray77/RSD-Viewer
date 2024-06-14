import { ButtonLabel, DialogButton } from "../Common/Buttons";
import { ArrayRange, CollapsableRandomArray } from "../Services/Math";
import { AccountData, AddAccountHandler } from "../Services/AccountData";
import { StatePair, useStatePair } from "../StatePair";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { DialogInput } from "../Common/Inputs";
import { AppState } from "../App";
import { ToolTip } from "../Common/CommonElements";
import React from "react";

const GeneratePassword = (state: ToolbarState): string => {
	/*if (state.account.Value.Name == "") {
		return;
	}*/

	let passwordParams = state.passwordParams.Value;

	console.log("Generating pass");

	let newPass: string = "";

	let min =
		!passwordParams[0] && !passwordParams[1] && !passwordParams[2]
			? 97
			: passwordParams[2]
			? 33
			: passwordParams[1]
			? 48
			: 65;

	let max = passwordParams[2] ? 126 : 122;

	let exclusions: number[] = [];

	if (!passwordParams[0] && (passwordParams[2] || passwordParams[1])) {
		exclusions = exclusions.concat(ArrayRange(65, 90));
	}

	if (!passwordParams[1] && passwordParams[2]) {
		exclusions = exclusions.concat(ArrayRange(48, 57));
	}

	if (!passwordParams[2]) {
		if (passwordParams[1]) {
			exclusions = exclusions.concat(ArrayRange(58, 64));
			exclusions = exclusions.concat(ArrayRange(91, 96));
		}

		if (passwordParams[0]) {
			exclusions = exclusions.concat(ArrayRange(91, 96));
		}
	}

	console.log(exclusions);

	let asciiCharacters = CollapsableRandomArray(
		min,
		max,
		new Set(exclusions),
		state.passwordLength.Value
	);

	for (let i = 0; i < state.passwordLength.Value; i++) {
		newPass += String.fromCharCode(asciiCharacters[i]);
	}

	return newPass;
};

const FlipPasswordParam = (param: number, passwordParams: StatePair<boolean[]>) => {
	let newParams = [...passwordParams.Value];
	newParams[param] = !newParams[param];
	passwordParams.Set(newParams);
};


function GeneratePasswordDialog(props: {
	ToolbarState: ToolbarState;
	AppState: AppState;
}): JSX.Element {
	const {
		showDialog,
		passwordParams,
		passwordLength
	} = props.ToolbarState;
	
	const inputName = useStatePair("");
	const hoveringOnSlider = useStatePair(false);
	const dialogRef = React.useRef<HTMLDivElement>(null);

	const tooltipOffset: [number, number] = dialogRef.current ? [dialogRef.current.getBoundingClientRect().x,  dialogRef.current.getBoundingClientRect().y] : [0, 0];

	return (
		<ToolbarDialog
			dialogTag={ShowDialog.GeneratePassword}
			showDialog={showDialog}
			title={"Generate A Password"}
			onClose={() => { inputName.Set(""); }}
		>
			{
				hoveringOnSlider.Value ? (
					<ToolTip offset={tooltipOffset}>{passwordLength.Value.toString()}</ToolTip>
				) : <></>
			}
			<div id="input-group" className="px-10" ref={dialogRef}>
				<DialogInput label="Account Name: " value={inputName} required={true} className="my-5" />
				<div className="my-5">
					<label className="text-xl">Password Parameters: </label>
					<div>
						<input
							className="inline-flex  px-3"
							type="checkbox"
							title="Upper Case"
							onClick={() => {
								FlipPasswordParam(0, passwordParams);
							}}
							checked={passwordParams.Value[0]}
						/>
						<label> Upper Case </label>
						<input
							className="inline-flex  px-3"
							type="checkbox"
							title="Numbers"
							onClick={() => {
								FlipPasswordParam(1, passwordParams);
							}}
							checked={passwordParams.Value[1]}
						/>
						<label> Numbers </label>
						<input
							className="inline-flex px-3"
							type="checkbox"
							title="Special Characters"
							onClick={() => {
								FlipPasswordParam(2, passwordParams);
							}}
							checked={passwordParams.Value[2]}
						/>
						<label> Special Characters </label>
					</div>
					<div className="my-5">
						<label className="text-xl">Password Length:</label>
						<div>
							<input
								type="range"
								min={8}
								max={32}
								value={passwordLength.Value}
								className="slider"
								onChange={(e) => {
									passwordLength.Set(parseInt(e.target.value.valueOf()));
									//props.AppState.tooltip.Set(passwordLength.Value.toString());
								}}
								onMouseEnter={() => {
									hoveringOnSlider.Set(true);
								}}
								onMouseLeave={() => {
									hoveringOnSlider.Set(false);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<DialogButton
				className={
					inputName.Value == "" ? " cursor-not-allowed opacity-50" : ""
				}
				onClick={() => {
					if (inputName.Value == "") return;

					let pass = GeneratePassword(props.ToolbarState);
					
					AddAccountHandler(new AccountData(inputName.Value, pass), props.AppState);
					
					inputName.Set("");
					showDialog.Set(ShowDialog.None);
				}}
			>
				<ButtonLabel>Add</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default GeneratePasswordDialog