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
	const [shouldAddAccount, setShouldAddAccount] = useState(false);
	const [shouldGenerate, setShouldGenerate] = useState(false);
	const [accountName, setAccountName] = useState("");
	const [accountPassword, setAccountPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [shouldAddPhoneNumber, setShouldAddPhoneNumber] = useState(false);
	const [code, setCode] = useState("");
	const [shouldVerify2FA, setShouldVerify2FA] = useState(false);
	const [passwordParams, setPasswordParams] = useState([true, true, true]);
	const [passwordLength, setPasswordLength] = useState(16);
	const [genPassFlag, setGenPassFlag] = useState(false);

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

	const VerifyNumber = (phoneNumber: string) => {};

	const VerifyCode = (code: string) => {};

	useEffect(() => {
		if (genPassFlag) {
			OnAddAccount();
			setShouldGenerate(false);
			setGenPassFlag(false);
		}
	}, [genPassFlag]);

	return (
		<div id="Toolbar" className="p-8 bg-slate-700">
			<h1 className="p-3 text-2xl inline-flex" id="Title">
				RSD Password Manager
			</h1>
			<HeaderButton
				onClick={() => {
					setShouldAddAccount(true);
				}}
				title="Add Account"
			/>
			<HeaderButton
				onClick={() => {
					setShouldGenerate(true);
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
					setShouldAddPhoneNumber(true);
				}}
				title="Add 2FA"
			/>
			<AddAccountDialog
				shouldAddAccount={shouldAddAccount}
				setShouldAddAccount={setShouldAddAccount}
				accountName={accountName}
				setAccountName={setAccountName}
				accountPassword={accountPassword}
				setAccountPassword={setAccountPassword}
				OnAddAccount={OnAddAccount}
			/>
			<GeneratePasswordDialog
				shouldGenerate={shouldGenerate}
				setShouldGenerate={setShouldGenerate}
				accountName={accountName}
				setAccountName={setAccountName}
				passwordParams={passwordParams}
				passwordLength={passwordLength}
				setPasswordLength={setPasswordLength}
				FlipPasswordParam={FlipPasswordParam}
				OnGeneratePassword={OnGeneratePassword}
			/>
			<AddPhoneNumberDialog
				shouldAddPhoneNumber={shouldAddPhoneNumber}
				setShouldAddPhoneNumber={setShouldAddPhoneNumber}
				phoneNumber={phoneNumber}
				setPhoneNumber={setPhoneNumber}
				VerifyNumber={VerifyNumber}
			/>
			<Verify2FADialog
				shouldVerify2FA={shouldVerify2FA}
				setShouldVerify2FA={setShouldVerify2FA}
				code={code}
				setCode={setCode}
				VerifyCode={VerifyCode}
			/>
		</div>
	);
}
