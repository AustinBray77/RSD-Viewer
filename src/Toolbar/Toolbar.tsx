import { useEffect } from "react";
import { StatePair, useStatePair } from "../StatePair";
import { AppState } from "../App";
import { ExportFile, ImportFile } from "../FileHandling";
import GeneratePasswordDialog from "./PasswordGeneratorDialog";
import AddAccountDialog from "./AddAccountDialog";
import AddPhoneNumberDialog from "./AddPhoneNumberDialog";
import Verify2FADialog from "./Verify2FADialog";
import { AccountData } from "../Services/AccountData";

enum ShowDialog {
	None,
	AddAccount,
	GeneratePassword,
	AddPhoneNumber,
	Verify2FA
}

type ToolbarState = {
	showDialog: StatePair<ShowDialog>
	account: StatePair<AccountData>
	phoneNumber: StatePair<string> 
	tfaCode: StatePair<string> 
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

const VerifyNumber = (phoneNumber: string) => {};

const VerifyCode = (code: string) => {};

function Add2FA(): void {}

export default function Toolbar(props: {
	AppState: AppState,
	getData: (password: string) => void
}): JSX.Element {
	
	const {
		data,
		password,
		error
	} = props.AppState

	const state: ToolbarState = {
		showDialog: useStatePair<ShowDialog>(ShowDialog.None),
		account: useStatePair<AccountData>(new AccountData("", "")),
		phoneNumber: useStatePair<string>(""),
		tfaCode: useStatePair<string>(""),
		passwordParams: useStatePair<boolean[]>([true, true, true]),
		passwordLength: useStatePair<number>(16),
		genPassFlag: useStatePair<boolean>(false)
	}

	return (
		<div id="Toolbar" className="p-8 bg-slate-700">
			<h1 className="p-3 text-2xl inline-flex" id="Title">
				RSD Password Manager
			</h1>
			<HeaderButton
				onClick={() => {
					state.showDialog.Set(ShowDialog.AddAccount);
				}}
				title="Add Account"
			/>
			<HeaderButton
				onClick={() => {
					state.showDialog.Set(ShowDialog.GeneratePassword);
				}}
				title="Generate Password"
			/>
			<HeaderButton
				onClick={() => {
					ExportFile(error.Set);
				}}
				title="Export Save File"
			/>
			<HeaderButton
				onClick={() => {
					ImportFile(error.Set, props.getData, password.Value);
				}}
				title="Import Save File"
			/>
			<HeaderButton
				onClick={() => {
					state.showDialog.Set(ShowDialog.AddPhoneNumber);
				}}
				title="Add 2FA"
			/>
			<AddAccountDialog
				ToolbarState={state}
				AppState={props.AppState}
			/>
			<GeneratePasswordDialog
				ToolbarState={state}
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


export { Toolbar, ToolbarState, ShowDialog }