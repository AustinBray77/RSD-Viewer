import { DialogButton, DialogLabel } from "../Components/Buttons";
import { ArrayRange, CollapsableRandomArray } from "../Utils/Math";
import { AccountData } from "../Utils/AccountData";
import { StatePair } from "../Utils/StatePair";
import BasicDialog from "../Components/Dialogs";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Utils/Functions";
import { Input, InputGroup, CheckBoxRow, Slider } from "../Components/Forms";

const GeneratePassword = (state: ToolbarState) => {
	if (state.account.Value.Name == "") {
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

	state.account.Set(new AccountData(state.account.Value.Name, newPass));
};

const FlipPasswordParam = (param: number, passwordParams: StatePair<boolean[]>) => {
	let newParams = [...passwordParams.Value];
	newParams[param] = !newParams[param];
	passwordParams.Set(newParams);
};


function GeneratePasswordDialog(props: {
	ToolbarState: ToolbarState;
}): JSX.Element {
	const {
		showDialog,
		account,
		passwordParams,
		passwordLength
	} = props.ToolbarState;
	
	return (
		<BasicDialog
			open={showDialog.Value == ShowDialog.GeneratePassword}
			onClose={() => {
				showDialog.Set(ShowDialog.None)
				ClearToolbar(props.ToolbarState);
			}}
			title={"Generate A Password"}
		>
			<InputGroup>
				<Input 
					title="Account Name: "
					type="text"
					onChange={(e) => {
						account.Set(new AccountData(e.target.value, ""));
					}}
					requirement={account.Value.Name != ""}
				/>
				<CheckBoxRow 
					title="Password Parameters: "
					length={3}
					checkBoxProps={[
						{
							label: "Upper Case",
							onClick: () => {
								FlipPasswordParam(0, passwordParams);
							},
							checked:passwordParams.Value[0]
						},
						{
							label: "Numbers",
							onClick: () => {
								FlipPasswordParam(1, passwordParams);
							},
							checked:passwordParams.Value[1]
						},
						{
							label: "Special Characters",
							onClick: () => {
								FlipPasswordParam(2, passwordParams);
							},
							checked:passwordParams.Value[2]
						}
					]}
				/>
				<Slider 
					title="Password Length: "
					min={8}
					max={32}
					value={passwordLength.Value}
					onChange={(e) => {
						passwordLength.Set(parseInt(e.target.value.valueOf()));
					}}
				/>
			</InputGroup>
			<DialogButton
				enabled={account.Value.Name != ""}
				onClick={() => {
					GeneratePassword(props.ToolbarState);
					ClearToolbar(props.ToolbarState);
					showDialog.Set(ShowDialog.None);
				}}
			>
				<DialogLabel>Add</DialogLabel>
			</DialogButton>
		</BasicDialog>
	);
}

export default GeneratePasswordDialog