import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import AccountData from "./AccountData";
import { DialogButton } from "./Buttons";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { type } from "os";

const ToolBarDialog = (props: {
	open: boolean;
	onClose?: (e: {}, r: "backdropClick" | "escapeKeyDown") => void;
	children?: JSX.Element | JSX.Element[];
	title?: string;
}): JSX.Element => {
	return (
		<Dialog open={props.open} onClose={props.onClose} className="backdrop-blur">
			<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
				<h2 className="text-3xl px-10 text-slate-100">{props.title}</h2>
				{props.children}
			</div>
		</Dialog>
	);
};

export default function Toolbar(props: {
	data: AccountData[];
	setData: (val: AccountData[]) => void;
	setError: React.Dispatch<React.SetStateAction<string>>;
	getData: (password: string) => void;
	stablePassword: string;
}): JSX.Element {
	const [shouldAddAccount, setShouldAddAccount] = useState(false);
	const [shouldGenerate, setShouldGenerate] = useState(false);
	const [accountName, setAccountName] = useState("");
	const [accountPassword, setAccountPassword] = useState("");
	const [passwordParams, setPasswordParams] = useState([true, true, true]);
	const [passwordLength, setPasswordLength] = useState(16);
	const [genPassFlag, setGenPassFlag] = useState(false);

	const CollapsableRandomArray = (
		min: number,
		max: number,
		exclude: Set<number>,
		numberOfResults: number = 1
	): number[] => {
		let possibleResults: number[] = [];

		for (let i = min; i <= max; i++) {
			if (!exclude.has(i)) {
				possibleResults.push(i);
			}
		}

		console.log(possibleResults);

		let output: number[] = [];

		for (let i = 0; i < numberOfResults; i++) {
			let rawResult: number = Math.floor(
				Math.random() * (possibleResults.length - 1)
			);
			output.push(possibleResults[rawResult]);
		}

		console.log(output);

		return output;
	};

	const ArrayRange = (min: number, max: number): number[] => {
		let output: number[] = [];

		for (let i = min; i <= max; i++) {
			output.push(i);
		}

		return output;
	};

	const FlipPasswordParam = (param: number) => {
		let newParams = [...passwordParams];
		newParams[param] = !newParams[param];
		setPasswordParams(newParams);
	};

	const OnAddAccount = () => {
		if (accountName == "" || accountPassword == "") {
			return;
		}

		console.log("Adding Account...");

		let newData = [...props.data];
		let newAccount = new AccountData(accountName, accountPassword);

		newData.push(newAccount);

		props.setData(newData);
		setAccountName("");
		setAccountPassword("");

		setShouldAddAccount(false);
	};

	const OnGeneratePassword = async () => {
		if (accountName == "") {
			return;
		}

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
			passwordLength
		);

		for (let i = 0; i < passwordLength; i++) {
			newPass += String.fromCharCode(asciiCharacters[i]);
		}

		console.log(newPass);

		setAccountPassword(newPass);
		setGenPassFlag(true);
	};

	useEffect(() => {
		if (genPassFlag) {
			OnAddAccount();
			setShouldGenerate(false);
			setGenPassFlag(false);
		}
	}, [genPassFlag]);

	return (
		<div id="Toolbar" className="p-8 bg-slate-700">
			<h1 className="p-3 text-4xl inline-flex" id="Title">
				RSD Password Manager
			</h1>
			<div className="inline-flex border-1 border-slate-700">
				<button
					className="text-2xl p-3"
					onClick={() => {
						setShouldAddAccount(true);
					}}
				>
					Add Account
				</button>
			</div>
			<div className="inline-flex border-1 border-slate-700">
				<button
					className="text-2xl p-3"
					onClick={() => {
						setShouldGenerate(true);
					}}
				>
					Generate Password
				</button>
			</div>
			<div className="inline-flex border-1 border-slate-700">
				<button
					className="text-2xl p-3"
					onClick={() => {
						Promise.resolve(invoke<string>("get_file_path")).then(
							(res: string) => {
								open({
									defaultPath: res,
								});
							}
						);
					}}
				>
					Grab Save File
				</button>
			</div>
			<div className="inline-flex border-1 border-slate-700">
				<button
					className="text-2xl p-3"
					onClick={() => {
						Promise.resolve(
							open({
								defaultPath: "C:\\",
							})
						).then((res: string | string[] | null) => {
							if (typeof res == typeof [""] || typeof res == typeof null) {
								return;
							}

							Promise.resolve(invoke("set_save_data", { path: res }))
								.then(() => {
									props.getData(props.stablePassword);
								})
								.catch((err) => {
									props.setError(err);
								});
						});
					}}
				>
					Import Save File
				</button>
			</div>
			<ToolBarDialog
				open={shouldAddAccount}
				onClose={() => {
					setAccountName("");
					setAccountPassword("");
					setShouldAddAccount(false);
				}}
				title={"Add an Account"}
			>
				<div id="input-group" className="px-10">
					<div className="my-5">
						<label className="text-xl">Account Name: </label>
						<input
							type="text"
							onChange={(e) => {
								setAccountName(e.target.value);
							}}
							className={
								"focus:outline-none bg-slate-700 border-2 rounded " +
								(accountName == ""
									? "border-rose-500"
									: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
							}
						/>
						<br />
						<label
							className={
								accountName == "" ? "text-slate-500" : "text-slate-700"
							}
						>
							This field is required
						</label>
					</div>
					<div className="my-5">
						<label className="text-xl">Password: </label>
						<input
							type="Password"
							onChange={(e) => {
								setAccountPassword(e.target.value);
							}}
							className={
								"focus:outline-none bg-slate-700 border-2 rounded " +
								(accountPassword == ""
									? "border-rose-500"
									: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
							}
						/>
						<br />
						<label
							className={
								accountPassword == "" ? "text-slate-500" : "text-slate-700"
							}
						>
							This field is required
						</label>
					</div>
				</div>
				<DialogButton
					className={
						accountName == "" || accountPassword == ""
							? " cursor-not-allowed opacity-50"
							: ""
					}
					onClick={OnAddAccount}
				>
					<div className="text-slate-100 text-xl py-2 px-7">Add</div>
				</DialogButton>
			</ToolBarDialog>
			<ToolBarDialog
				open={shouldGenerate}
				onClose={() => {
					setShouldGenerate(false);
				}}
				title={"Generate A Password"}
			>
				<div id="input-group" className="px-10">
					<div className="my-5">
						<label className="text-xl">Account Name: </label>
						<input
							type="text"
							onChange={(e) => {
								setAccountName(e.target.value);
							}}
							className={
								"focus:outline-none bg-slate-700 border-2 rounded " +
								(accountName == ""
									? "border-rose-500"
									: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
							}
						/>
						<br />
						<label
							className={
								accountName == "" ? "text-slate-500" : "text-slate-700"
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
									FlipPasswordParam(0);
								}}
								checked={passwordParams[0]}
							/>
							<label> Upper Case </label>
							<input
								className="inline-flex  px-3"
								type="checkbox"
								title="Numbers"
								onClick={() => {
									FlipPasswordParam(1);
								}}
								checked={passwordParams[1]}
							/>
							<label> Numbers </label>
							<input
								className="inline-flex px-3"
								type="checkbox"
								title="Special Characters"
								onClick={() => {
									FlipPasswordParam(2);
								}}
								checked={passwordParams[2]}
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
									value={passwordLength}
									className="slider"
									onChange={(e) => {
										setPasswordLength(parseInt(e.target.value.valueOf()));
									}}
								/>
							</div>
						</div>
					</div>
				</div>
				<DialogButton
					className={accountName == "" ? " cursor-not-allowed opacity-50" : ""}
					onClick={() => {
						OnGeneratePassword();
					}}
				>
					<div className="text-slate-100 text-xl py-2 px-7">Add</div>
				</DialogButton>
			</ToolBarDialog>
		</div>
	);
}
