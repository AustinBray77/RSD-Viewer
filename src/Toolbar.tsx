import React, { useEffect, useState } from "react";
import AccountData from "./AccountData";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import {
	AddAccountDialog,
	AddPhoneNumberDialog,
	GeneratePasswordDialog,
	Verify2FADialog,
} from "./Dialogs";
import { ArrayRange, CollapsableRandomArray } from "./Math";
import { StatePair, useStatePair } from "./StatePair";

type ToolbarState = {
	shouldAddAccount: StatePair<boolean>
	shouldGenerate: StatePair<boolean>
	accountName: StatePair<string>
	accountPassword: StatePair<string>
	phoneNumber: StatePair<string> 
	shouldAddPhoneNumber: StatePair<boolean>
	tfaCode: StatePair<string> 
	shouldVerify2FA: StatePair<boolean>
	passwordParams: StatePair<boolean[]>
	passwordLength: StatePair<number>
	genPassFlag: StatePair<boolean>
}

function HeaderButton(props: {
	onClick: () => void;
	title: string;
}): JSX.Element {
	return (
		<div className="inline-flex border-1 border-slate-700">
			<button className="text-xl p-3" onClick={props.onClick}>
				{props.title}
			</button>
		</div>
	);
}

function ExportFile(
	setError: React.Dispatch<React.SetStateAction<string>>
): void {
	Promise.resolve(invoke<string>("get_file_path"))
		.then((res: string) => {
			return Promise.resolve(
				open({
					defaultPath: res,
					directory: true,
					multiple: false,
				})
			);
		})
		.then((res: string | string[] | null) => {
			if (typeof res == typeof [""] || typeof res == typeof null) {
				throw "Invalid Location";
			}

			return Promise.resolve(invoke<string>("copy_save_data", { path: res }));
		})
		.then((res: string) => {
			setError(`File was successfully saved at "${res}"`);
		})
		.catch((error) => {
			setError(error);
		});
}

function ImportFile(
	setError: React.Dispatch<React.SetStateAction<string>>,
	getData: (password: string) => void,
	stablePassword: string
): void {
	let options = {
		defaultPath: "C:\\",
		multiple: false,
		directory: false,
		filters: [
			{
				name: "Binary Files (*.bin)",
				extensions: ["bin"],
			},
			{
				name: "All Files",
				extensions: ["*"],
			},
		],
	};

	Promise.resolve(open(options))
		.then((res: string | string[] | null) => {
			if (typeof res == typeof [""] || typeof res == typeof null) {
				throw "Invalid Location";
			}

			return Promise.resolve(invoke("set_save_data", { path: res }));
		})
		.then(() => {
			getData(stablePassword);
		})
		.catch((err) => {
			setError(err);
		});
}

function Add2FA(): void {}

export default function Toolbar(props: {
	data: AccountData[];
	setData: (val: AccountData[]) => void;
	setError: React.Dispatch<React.SetStateAction<string>>;
	getData: (password: string) => void;
	stablePassword: string;
}): JSX.Element {
	
	const state: ToolbarState = {
		shouldAddAccount: useStatePair<boolean>(false),
		shouldGenerate: useStatePair<boolean>(false),
		accountName: useStatePair<string>(""),
		accountPassword: useStatePair<string>(""),
		phoneNumber: useStatePair<string>(""),
		shouldAddPhoneNumber: useStatePair<boolean>(false),
		tfaCode: useStatePair<string>(""),
		shouldVerify2FA: useStatePair<boolean>(false),
		passwordParams: useStatePair<boolean[]>([true, true, true]),
		passwordLength: useStatePair<number>(16),
		genPassFlag: useStatePair<boolean>(false)
	}

	const FlipPasswordParam = (param: number) => {
		let newParams = [...state.passwordParams.Value];
		newParams[param] = !newParams[param];
		state.passwordParams.Set(newParams);
	};

	const OnAddAccount = () => {
		if (state.accountName.Value == "" || state.accountPassword.Value == "") {
			return;
		}

		console.log("Adding Account...");

		let newData = [...props.data];
		let newAccount = new AccountData(state.accountName.Value, state.accountPassword.Value);

		newData.push(newAccount);

		props.setData(newData);
		state.accountName.Set("");
		state.accountPassword.Set("");

		state.shouldAddAccount.Set(false);
	};

	const OnGeneratePassword = async () => {
		if (state.accountName.Value == "") {
			return;
		}

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

		console.log(newPass);

		state.accountPassword.Set(newPass);
		state.genPassFlag.Set(true);
	};

	const VerifyNumber = (phoneNumber: string) => {};

	const VerifyCode = (code: string) => {};

	useEffect(() => {
		if (state.genPassFlag.Value) {
			OnAddAccount();
			state.shouldGenerate.Set(false);
			state.genPassFlag.Set(false);
		}
	}, [state.genPassFlag]);

	return (
		<div id="Toolbar" className="p-8 bg-slate-700">
			<h1 className="p-3 text-2xl inline-flex" id="Title">
				RSD Password Manager
			</h1>
			<HeaderButton
				onClick={() => {
					state.shouldAddAccount.Set(true);
				}}
				title="Add Account"
			/>
			<HeaderButton
				onClick={() => {
					state.shouldGenerate.Set(true);
				}}
				title="Generate Password"
			/>
			<HeaderButton
				onClick={() => {
					ExportFile(props.setError);
				}}
				title="Export Save File"
			/>
			<HeaderButton
				onClick={() => {
					ImportFile(props.setError, props.getData, props.stablePassword);
				}}
				title="Import Save File"
			/>
			<HeaderButton
				onClick={() => {
					state.shouldAddPhoneNumber.Set(true);
				}}
				title="Add 2FA"
			/>
			<AddAccountDialog
				ToolbarState={state}
				OnAddAccount={OnAddAccount}
			/>
			<GeneratePasswordDialog
				ToolbarState={state}
				FlipPasswordParam={FlipPasswordParam}
				OnGeneratePassword={OnGeneratePassword}
			/>
			<AddPhoneNumberDialog
				ToolbarState={state}
				VerifyNumber={VerifyNumber}
			/>
			<Verify2FADialog
				ToolbarState={state}
				VerifyCode={VerifyCode}
			/>
		</div>
	);
}


export { ToolbarState }