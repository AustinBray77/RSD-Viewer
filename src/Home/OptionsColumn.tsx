import React, { useState } from "react";
import { AccountData } from "../Utils/AccountData";
import { DialogButton, DialogLabel, OptionsButton } from "../Components/Buttons";
import { StandardBox } from "./CommonElements";
import BasicDialog from "../Components/Dialogs";

function CopyPasswordButton(props: {
	text: string;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element {
	const onClick = () => {
		navigator.clipboard.writeText(props.text);
		props.setDialog(
			<BasicDialog
				open={true}
				onClose={() => {
					props.setDialog(<div></div>);
				}}
			>
				<h3 className="text-3xl">Password has been copied to clipboard.</h3>
				<DialogButton
					onClick={() => {
						props.setDialog(<div></div>);
					}}
					className={"my-5"}
				>
					<DialogLabel>Ok</DialogLabel>
				</DialogButton>
			</BasicDialog>
		);
	};

	return (
		<OptionsButton className="inline-flex" onClick={onClick}>
			Copy
		</OptionsButton>
	);
}

function ChangePasswordButton(props: {
	accountIndex: number;
	data: AccountData[];
	setData: (val: AccountData[]) => void;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element {
	

	const onClick = () => {
		props.setDialog(<ChangePasswordDialog />);
	};

	return (
		<OptionsButton className="inline-flex" onClick={onClick}>
			Change
		</OptionsButton>
	);
}

function RemovePasswordButton(props: {
	accountIndex: number;
	data: AccountData[];
	setData: (val: AccountData[]) => void;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element {
	const [confirmation, setConfirmation] = useState(0);

	

	const onClick = () => {
		console.log(
			`Remove Clicked for account: ${props.data[props.accountIndex].Name}`
		);
		props.setDialog(<RemovePasswordDialog />);
	};

	return (
		<OptionsButton className="inline-flex" onClick={onClick}>
			Remove
		</OptionsButton>
	);
}

export default function OptionsColumn(props: {
	data: AccountData[];
	setData: (val: AccountData[]) => void;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element {
	let buttonList: JSX.Element[] = [];

	for (let i = 0; i < props.data.length; i++) {
		let account = props.data[i];
		let x = i;

		buttonList.push(
			<li>
				<StandardBox>
					<CopyPasswordButton
						text={account.Password}
						setDialog={props.setDialog}
					/>
					<ChangePasswordButton
						accountIndex={x}
						data={props.data}
						setData={props.setData}
						setDialog={props.setDialog}
					/>
					<RemovePasswordButton
						accountIndex={x}
						data={props.data}
						setData={props.setData}
						setDialog={props.setDialog}
					/>
				</StandardBox>
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
