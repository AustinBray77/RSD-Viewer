import { DialogButton } from "../Buttons";
import { ArrayRange, CollapsableRandomArray } from "../Math";
import { AccountData } from "../Services/AccountData";
import { StatePair } from "../StatePair";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { ClearToolbar } from "../Services/ClearToolbar";

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
		<ToolbarDialog
			open={showDialog.Value == ShowDialog.GeneratePassword}
			onClose={() => {
				showDialog.Set(ShowDialog.None)
			}}
			title={"Generate A Password"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Account Name: </label>
					<input
						type="text"
						onChange={(e) => {
							account.Set(new AccountData(e.target.value, ""));
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(account.Value.Name == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							account.Value.Name == "" ? "text-slate-500" : "text-slate-700"
						}
					>
						This field is required
					</label>
				</div>
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
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<DialogButton
				className={
					account.Value.Name == "" ? " cursor-not-allowed opacity-50" : ""
				}
				onClick={() => {
					GeneratePassword(props.ToolbarState);
					ClearToolbar(props.ToolbarState);
					showDialog.Set(ShowDialog.None);
				}}
			>
				<div className="text-slate-100 text-xl py-2 px-7">Add</div>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default GeneratePasswordDialog