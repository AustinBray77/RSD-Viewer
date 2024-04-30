import Home from "./Home/Home";
import Toolbar from "./Toolbar/Toolbar";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api";
import { Dialog } from "@mui/material";
import { ButtonLabel, DialogButton } from "./Buttons";
import { StatePair, useStatePair } from "./StatePair";
import { AccountData } from "./Services/AccountData";

type AppState = {
	password: StatePair<string>,
	error: StatePair<string>,
	setData: (val: AccountData[]) => void,
	data: AccountData[]
}

function PasswordDialog(props: {
	password: StatePair<string>;
	onClose: any;
}) {
	const [input, setInput] = useState("");


	return (
		<Dialog
			open={props.password.Value == ""}
			onClose={() => {
				props.password.Set(input);
				props.onClose(input);
			}}
			className="backdrop-blur"
		>
			<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
				<h2 className="text-3xl px-10 text-slate-100">Login To RSD</h2>
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
						props.password.Set(input);
						props.onClose(input);
					}}
				>
					<ButtonLabel>Ok</ButtonLabel>
				</DialogButton>
			</div>
		</Dialog>
	);
}

function ErrorDialog(props: {
	onClose: () => void;
	error: String;
}): JSX.Element {
	let shouldOpen: boolean = props.error != "";

	return (
		<Dialog id="Error Dialog" open={shouldOpen} onClose={() => props.onClose()}>
			<div className="p-10 bg-slate-800">
				<h2 className="text-3xl text-slate-100 m-5">{props.error}</h2>
				<DialogButton onClick={() => props.onClose()} className="p-5">
					Ok
				</DialogButton>
			</div>
		</Dialog>
	);
}

function App() {
	const [data, setData] = useState<AccountData[]>([]);
	
	const getData = (password: string, isLegacy?: boolean): void => {
		invoke("get_data", { password: password, isLegacy: isLegacy == undefined ? false : isLegacy })
			.then((res) => {
				state.password.Set(password);

				if ((res as string) != "") {
					setData(AccountData.arrayFromJSON(res as string));
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
		setData: sendSetData,
		data: data
	}


	const onErrorClose = (): void => {
		if (state.error.Value.substring(0, 5) == "FATAL") {
			state.password.Set("");
		}

		state.error.Set("");
	};

	return (
		<div className="bg-slate-900 text-slate-100 min-h-screen overflow-hidden">
			<Toolbar AppState={state} getData={getData} />
			<Home data={state.data} setData={sendSetData} />
			<ErrorDialog onClose={onErrorClose} error={state.error.Value} />
			<PasswordDialog
				password={state.password}
				onClose={getData}
			/>
		</div>
	);
}

export { App, AppState };
