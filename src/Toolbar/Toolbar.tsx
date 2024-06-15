import { StatePair, useStatePair } from "../StatePair";
import { AppState } from "../App";
import { ImportFile } from "../Services/FileHandling";
import GeneratePasswordDialog from "./PasswordGeneratorDialog";
import AddAccountDialog from "./AddAccountDialog";
import AddPhoneNumberDialog from "./AddPhoneNumberDialog";
import Verify2FADialog from "./Verify2FADialog";
import { GetPhoneNumberFromData } from "../Services/AccountData";
import ImportFileDialog from "./ImportFileDialog";
import ToolbarHeader from "./ToolbarHeader";

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
	retracted: StatePair<boolean>
}

function RetractedHeader(props: { state: StatePair<boolean> }): JSX.Element {
	return <div className="bg-slate-700 flex h-5" onClick={() => { props.state.Set(false); }}>
	</div>
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
		phoneNumber: useStatePair<string>(phoneNumber),
		tfaCode: useStatePair<string>(""),
		passwordParams: useStatePair<boolean[]>([true, true, true]),
		passwordLength: useStatePair<number>(16),
		genPassFlag: useStatePair<boolean>(false),
		retracted: useStatePair<boolean>(false)
	}

	return (
		<div id="Toolbar">
			{ !state.retracted.Value ? 
				<ToolbarHeader has2FA={has2FA} state={state} appState={props.AppState} />
				: <RetractedHeader state={state.retracted} />
			}
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