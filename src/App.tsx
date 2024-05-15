import { Home } from "./Home/Home";
import Toolbar from "./Toolbar/Toolbar";
import { useState } from "react";
import { invoke } from "@tauri-apps/api";
import { Dialog } from "@mui/material";
import { ButtonLabel, DialogButton } from "./Common/Buttons";
import { StatePair, useStatePair } from "./StatePair";
import { AccountData, GetPhoneNumberFromData } from "./Services/AccountData";
import { ErrorDialog, GeneralDialog } from "./Common/Dialogs";

type AppState = {
	password: StatePair<string>,
	error: StatePair<string>,
	tfaCode: StatePair<string>,
	setData: (val: AccountData[]) => void,
	data: AccountData[]
}

function PasswordDialog(props: {
	password: StatePair<string>;
	onClose: any;
}) {
	const [input, setInput] = useState("");


	return (
		<GeneralDialog open={props.password.Value == ""} title="Login to RSD">
			<div id="input-group" className="px-10">
				<div className="my-5">
					<div>
						<label className="text-xl">
							Enter Master Password: <br />
						</label>
						<label className="text-m text-slate-500">
							If you haven't logged in before, set a password here
							<br />
						</label>
					</div>
					<input
						type="password"
						onChange={(e) => {
							setInput(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(input == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={input == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={input == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={() => {
					if (input == "") return;
					props.password.Set(input);
					props.onClose(input);
					setInput("");
				}}
			>
				<ButtonLabel>Ok</ButtonLabel>
			</DialogButton>
		</GeneralDialog>
	);
}

function TFALoginDialog(props: {
	state: AppState;
	onFail: () => void;
	onSuccess: () => void;
}) {
	const [testCode, setTestCode] = useState("");

	const {
		tfaCode,
		error
	} = props.state;

	return (
		<GeneralDialog
			open={tfaCode.Value != ""}
			onClose={() => {}}
			title={"Enter The 2FA Code"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">2FA Code: </label>
					<input
						type="text"
						onChange={(e) => {
							setTestCode(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(testCode == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={testCode == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={testCode == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={() => {
					if (testCode == "") return;

					if(testCode == tfaCode.Value) {
						props.onSuccess();
					} else {
						error.Set("FATAL ERROR: Invalid 2FA Code");
						props.onFail();
					}

					setTestCode("");
					tfaCode.Set("");
				}}
			>
				<ButtonLabel>Submit</ButtonLabel>
			</DialogButton>
		</GeneralDialog>
	);
}

function App() {
	const [data, setData] = useState<AccountData[]>([]);
	const [tempData, setTempData] = useState<AccountData[]>([]);
	
	const getData = (password: string, isLegacy?: boolean): void => {
		invoke("get_data", { password: password, isLegacy: isLegacy == undefined ? false : isLegacy })
			.then((res) => {
				state.password.Set(password);

				if ((res as string) != "") {
					let formattedData = AccountData.arrayFromJSON(res as string);
					let phoneNumber = GetPhoneNumberFromData(formattedData);

					if(phoneNumber != "") {
						invoke("send_2FA_code", { phoneNumber: phoneNumber })
							.then((res) => {
								state.tfaCode.Set(res as string);
							})
							.catch((err) => {
								state.error.Set(err as string);
							});
						setTempData(formattedData);
					} else {
						setData(formattedData);
					}
				}
			})
			.catch((err: string) => {
				state.error.Set("FATAL ERROR (password is likely incorrect): " + err);
			});
	};

	const sendSetData = (val: AccountData[]): void => {
		invoke("save_data", {
			data: AccountData.arrayToJSON(val),
			password: state.password.Value,
		})
			.then((res) => {
				setData(val);
			})
			.catch((err) => {
				state.error.Set(err);
			});
	};

	const state: AppState = {
		error: useStatePair<string>(""),
		password: useStatePair<string>(""),
		tfaCode: useStatePair<string>(""),
		setData: sendSetData,
		data: data
	}


	const onErrorClose = (): void => {
		if (state.error.Value.substring(0, 5) == "FATAL") {
			state.password.Set("");
		}

		state.error.Set("");
	};

	const clearData = (): void => {
		setData([]);
		setTempData([]);
	}

	return (
		<div className="bg-slate-900 text-slate-100 min-h-screen overflow-hidden">
			<Toolbar AppState={state} getData={getData} />
			<Home data={state.data} setData={sendSetData} />
			<ErrorDialog onClose={onErrorClose} error={state.error.Value} />
			<PasswordDialog
				password={state.password}
				onClose={getData}
			/>
			<TFALoginDialog 
				state={state}
				onSuccess={() => { setData(tempData); setTempData([]); console.log("Success"); }}
				onFail={() => { clearData(); console.log("Fail"); }}
			/>
		</div>
	);
}

export { App, AppState };