import { StatePair, useStatePair } from "../StatePair";
import { AppState } from "../App";
import { ExportFile, ImportFile } from "../Services/FileHandling";
import GeneratePasswordDialog from "./PasswordGeneratorDialog";
import AddAccountDialog from "./AddAccountDialog";
import AddPhoneNumberDialog from "./AddPhoneNumberDialog";
import Verify2FADialog from "./Verify2FADialog";
import { GetPhoneNumberFromData } from "../Services/AccountData";
import ImportFileDialog from "./ImportFileDialog";
import { Get2FACode } from "../Services/TwoFactorAuth";

enum ShowDialog {
	None,
	AddAccount,
	GeneratePassword,
	AddPhoneNumber,
	Verify2FA,
	ImportFile
}

type ToolbarState = {
	showDialog: StatePair<ShowDialog>
	phoneNumber: StatePair<string> 
	tfaCode: StatePair<string> 
	passwordParams: StatePair<boolean[]>
	passwordLength: StatePair<number>
	genPassFlag: StatePair<boolean>
}

function HeaderButton(props: {
	onClick: () => void;
	title: string;
	className?: string;
}): JSX.Element {
	return (
		<div className={"inline-flex border-1 border-slate-700 " + props.className!}>
			<button className="text-xl p-3" onClick={props.onClick}>
				{props.title}
			</button>
		</div>
	);
}

export default function Toolbar(props: {
	AppState: AppState,
	getData: (password: string, isLegacy?: boolean) => void
}): JSX.Element {
	
	const {
		data,
		password,
		error,
		isLoading
	} = props.AppState

	const phoneNumber = GetPhoneNumberFromData(data);
	const has2FA = phoneNumber != "";

	const state: ToolbarState = {
		showDialog: useStatePair<ShowDialog>(ShowDialog.None),
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
					state.showDialog.Set(ShowDialog.ImportFile);
				}}
				title="Import Save File"
			/>
			<HeaderButton
				onClick={() => {
					if(has2FA) {
						Get2FACode(phoneNumber, isLoading)
							.then((res: string) => {
								state.tfaCode.Set(res);
								state.showDialog.Set(ShowDialog.Verify2FA);
							})
							.catch((err: any) => {
								error.Set("2FA Error: " + err as string);
							});
					} else {
						state.showDialog.Set(ShowDialog.AddPhoneNumber);
					}
				}}
				title={has2FA ? "Remove 2FA" : "Add 2FA"}
			/>
			<AddAccountDialog
				ToolbarState={state}
				AppState={props.AppState}
			/>
			<GeneratePasswordDialog
				ToolbarState={state}
				AppState={props.AppState}
			/>
			<AddPhoneNumberDialog
				ToolbarState={state}
				AppState={props.AppState}
			/>
			<Verify2FADialog
				ToolbarState={state}
				AppState={props.AppState}
			/>
			<ImportFileDialog
				ToolbarState={state}
				importCallback={
					(isLegacy: boolean): void => {
						ImportFile(error.Set, props.getData, password.Value, isLegacy);
						state.showDialog.Set(ShowDialog.None);
					}
				}
			/>
		</div>
	);
}


export { Toolbar, ToolbarState, ShowDialog }