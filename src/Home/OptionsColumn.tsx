import React, { useState } from "react";
import { AccountData } from "../Services/AccountData";
import { ButtonLabel, DialogButton, OptionsButton } from "../Common/Buttons";
import { StandardHomeBox } from "../Common/CommonElements";
import { Dialog } from "@mui/material";
import { StatePair } from "../StatePair";
import { HomeState, ShowHomeDialog } from "./Home";
import { GeneralDialog } from "../Common/Dialogs";
import { dialog } from "@tauri-apps/api";

function CopyPasswordDialog(props: { state: HomeState }): JSX.Element {
	let {
		dialog
	} = props.state;
	
	return (<Dialog
		open={dialog.Value == ShowHomeDialog.CopyPassword}
		onClose={() => {
			dialog.Set(ShowHomeDialog.None);
		}}
		className="backdrop-blur"
	>
		<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
			<h3 className="text-3xl">Password has been copied to clipboard.</h3>
			<DialogButton
				onClick={() => {
					dialog.Set(ShowHomeDialog.None);
				}}
				className={"my-5"}
			>
				<ButtonLabel>Ok</ButtonLabel>
			</DialogButton>
		</div>
	</Dialog>);
}

function CopyPasswordButton(props: {
	text: string;
	dialog: StatePair<ShowHomeDialog>;
}): JSX.Element {
	const onClick = () => {
		navigator.clipboard.writeText(props.text);
		props.dialog.Set(ShowHomeDialog.CopyPassword);
	};

	return (
		<OptionsButton className="inline-flex" onClick={onClick}>
			Copy
		</OptionsButton>
	);
}

function ChangePasswordDialog (props: {
	state: HomeState
}): JSX.Element {
	let {
		data,
		setData,
		dialog,
		selectedAccount
	} = props.state
	
	const [password, setPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");

	return (
		<Dialog
			open={dialog.Value == ShowHomeDialog.ChangePassword}
			onClose={() => {
				setPassword("");
				dialog.Set(ShowHomeDialog.None);
			}}
			className="backdrop-blur"
		>
			<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
				<h3 className="text-3xl">
					Change Password for {data[selectedAccount.Value].Name}
				</h3>
				<div className="my-5">
					<label className="text-xl">New Password: </label>
					<input
						type="password"
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(password == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={password == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
				</div>
				<div className="my-5">
					<label className="text-xl">Confirm Password: </label>
					<input
						type="password"
						onChange={(e) => {
							setConfPassword(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(confPassword == "" || confPassword != password
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							confPassword == "" || confPassword != password
								? "text-slate-500"
								: "text-slate-700"
						}
					>
						{confPassword == ""
							? "This field is required"
							: "Passwords must match"}
					</label>
				</div>
				<DialogButton
					className={password == "" ? " cursor-not-allowed opacity-50" : ""}
					onClick={() => {
						if (password == "") {
							return;
						}

						let newData = [...data];
						newData[selectedAccount.Value].Password = password;

						setData(newData);
						setPassword("");
						setConfPassword("");
						dialog.Set(ShowHomeDialog.None);
					}}
				>
					<ButtonLabel>Change</ButtonLabel>
				</DialogButton>
			</div>
		</Dialog>
	);
};

function ChangePasswordButton(props: {
	state: HomeState
	accountIndex: number
}): JSX.Element {
	let {
		dialog,
		selectedAccount
	} = props.state;

	const onClick = () => {
		selectedAccount.Set(props.accountIndex);
		dialog.Set(ShowHomeDialog.ChangePassword);
	};

	return (
		<OptionsButton className="inline-flex" onClick={onClick}>
			Change
		</OptionsButton>
	);
}

function RemovePasswordDialog(props: {
	state: HomeState
}): JSX.Element {
	let {
		data,
		dialog,
		selectedAccount,
		setData
	} = props.state;
	
	return (
		<Dialog
			open={dialog.Value == ShowHomeDialog.RemovePassword}
			onClose={() => {
				dialog.Set(ShowHomeDialog.None);
			}}
			className="backdrop-blur"
		>
			<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
				<h3 className="text-3xl">
					Are you sure you want to remove the password for{" "}
					{data[selectedAccount.Value].Name}?
				</h3>
				<DialogButton
					onClick={() => {
						let newData = [...data];
						newData.splice(selectedAccount.Value, 1);

						setData(newData);
						dialog.Set(ShowHomeDialog.None);
					}}
				>
					<ButtonLabel>Ok</ButtonLabel>
				</DialogButton>
				<DialogButton
					onClick={() => {
						dialog.Set(ShowHomeDialog.None);
					}}
				>
					<ButtonLabel>Cancel</ButtonLabel>
				</DialogButton>
			</div>
		</Dialog>
	);
};

function RemovePasswordButton(props: {
	state: HomeState,
	accountIndex: number
}): JSX.Element {
	let {
		data,
		dialog,
		selectedAccount
	} = props.state;

	const onClick = () => {
		selectedAccount.Set(props.accountIndex);
		console.log(
			`Remove Clicked for account: ${data[selectedAccount.Value].Name}`
		);
		dialog.Set(ShowHomeDialog.RemovePassword);
	};

	return (
		<OptionsButton className="inline-flex" onClick={onClick}>
			Remove
		</OptionsButton>
	);
}

function OptionsColumn(props: {
	state: HomeState;
}): JSX.Element {
	let {
		data,
		dialog,
	} = props.state;

	let buttonList: JSX.Element[] = [];

	for (let i = 0; i < data.length; i++) {
		let account = data[i];
		
		if(account.IsSpecial) continue;
		
		let x = i;

		buttonList.push(
			<li>
				<StandardHomeBox>
					<CopyPasswordButton
						text={account.Password}
						dialog={dialog}
					/>
					<ChangePasswordButton state={props.state} accountIndex={x} />
					<RemovePasswordButton state={props.state} accountIndex={x} />
				</StandardHomeBox>
			</li>
		);
	}

	return (
		<div id="OptionsColumn" className="">
			<h3 className="text-2xl px-5">Options</h3>
			<div className="text-xl px-5">
				{buttonList.length > 0 ? <ul>{buttonList}</ul> : <div></div>}
			</div>
		</div>
	);
}

export { OptionsColumn, CopyPasswordDialog, ChangePasswordDialog, RemovePasswordDialog };