import React, { useState } from "react";
import { AccountData } from "../Services/AccountData";
import { ButtonLabel, DialogButton, OptionsButton } from "../Common/Buttons";
import { StandardHomeBox } from "../Common/CommonElements";
import { Dialog } from "@mui/material";
import { StatePair, useStatePair } from "../StatePair";
import { HomeState, ShowHomeDialog } from "./Home";
import { GeneralDialog } from "../Common/Dialogs";
import { dialog } from "@tauri-apps/api";
import HomeDialog from "./HomeDialog";
import { DialogInput } from "../Common/Inputs";

function CopyPasswordDialog(props: { state: HomeState }): JSX.Element {
	let {
		dialog
	} = props.state;
	
	return <HomeDialog
		dialogTag={ShowHomeDialog.CopyPassword}
		showDialog={dialog}
		title="Password has been copied to clipboard."
	>
		<DialogButton
			onClick={() => {
				dialog.Set(ShowHomeDialog.None);
			}}
			className={"my-5"}
		>
			<ButtonLabel>Ok</ButtonLabel>
		</DialogButton>
	</HomeDialog>
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
	
	const password = useStatePair("");
	const confPassword = useStatePair("");

	if(selectedAccount.Value == -1 || data.length == 0) {
		return <></>
	}

	return (
		<HomeDialog
			dialogTag={ShowHomeDialog.ChangePassword}
			showDialog={dialog}
			onClose={() => {
				password.Set("");
				confPassword.Set("");
			}}
			title={"Change Password for " + data[selectedAccount.Value].Name}
		>
			<div id="input-group" className="px-10">
				<DialogInput label="New Password: " value={password} className="my-5" required={true} type="password" />
				<DialogInput label="Confirm Password: " value={confPassword} className="my-5" required={true} type="password" />
			</div>
			<DialogButton
				className={password.Value == "" || confPassword.Value == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={() => {
					if (password.Value == "" || confPassword.Value == "" || password.Value != confPassword.Value) {
						return;
					}

					let newData = [...data];
					newData[selectedAccount.Value].Password = password.Value;

					setData(newData);
					password.Set("");
					confPassword.Set("");
					dialog.Set(ShowHomeDialog.None);
				}}
			>
				<ButtonLabel>Change</ButtonLabel>
			</DialogButton>
		</HomeDialog>
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
	
	if(selectedAccount.Value == -1 || data.length == 0) {
		return <></>
	}


	return (
		<HomeDialog
			dialogTag={ShowHomeDialog.RemovePassword}
			onClose={() => {
				dialog.Set(ShowHomeDialog.None);
			}}
			showDialog={dialog}
			title={"Are you sure you want to remove the password for " + data[selectedAccount.Value].Name + "?"}
		>
			<div className="my-5"/>
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
		</HomeDialog>
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