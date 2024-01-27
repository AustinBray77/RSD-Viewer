import React, { useState } from "react";
import { AccountData } from "../Services/AccountData";
import { DialogButton, DialogLabel, OptionsButton } from "../Components/Buttons";
import { StandardBox } from "./CommonElements";
import { Dialog } from "@mui/material";

function CopyPasswordButton(props: {
	text: string;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element {
	const onClick = () => {
		navigator.clipboard.writeText(props.text);
		props.setDialog(
			<Dialog
				open={true}
				onClose={() => {
					props.setDialog(<div></div>);
				}}
				className="backdrop-blur"
			>
				<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
					<h3 className="text-3xl">Password has been copied to clipboard.</h3>
					<DialogButton
						onClick={() => {
							props.setDialog(<div></div>);
						}}
						className={"my-5"}
					>
						<DialogLabel>Ok</DialogLabel>
					</DialogButton>
				</div>
			</Dialog>
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
	const ChangePasswordDialog = (): JSX.Element => {
		const [password, setPassword] = useState("");
		const [confPassword, setConfPassword] = useState("");

		return (
			<Dialog
				open={true}
				onClose={() => {
					setPassword("");
					props.setDialog(<div></div>);
				}}
				className="backdrop-blur"
			>
				<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
					<h3 className="text-3xl">
						Change Password for {props.data[props.accountIndex].Name}
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

							let newData = [...props.data];
							newData[props.accountIndex].Password = password;

							props.setData(newData);
							setPassword("");
							setConfPassword("");
							props.setDialog(<div></div>);
						}}
					>
						<DialogLabel>Change</DialogLabel>
					</DialogButton>
				</div>
			</Dialog>
		);
	};

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

	const RemovePasswordDialog = (): JSX.Element => {
		return (
			<Dialog
				open={true}
				onClose={() => {
					props.setDialog(<div></div>);
				}}
				className="backdrop-blur"
			>
				<div id="DialogContainer" className="p-10 bg-slate-700 text-slate-300">
					<h3 className="text-3xl">
						Are you sure you want to remove the password for{" "}
						{props.data[props.accountIndex].Name}?
					</h3>
					<DialogButton
						onClick={() => {
							let newData = [...props.data];
							newData.splice(props.accountIndex, 1);

							props.setData(newData);
							props.setDialog(<div></div>);
						}}
					>
						<DialogLabel>Ok</DialogLabel>
					</DialogButton>
					<DialogButton
						onClick={() => {
							props.setDialog(<div></div>);
						}}
					>
						<DialogLabel>Cancel</DialogLabel>
					</DialogButton>
				</div>
			</Dialog>
		);
	};

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
