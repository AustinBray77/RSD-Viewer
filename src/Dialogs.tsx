import React from "react";
import { Dialog } from "@mui/material";
import { DialogButton } from "./Buttons";

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

function GeneratePasswordDialog(props: {
	shouldGenerate: boolean;
	setShouldGenerate: React.Dispatch<React.SetStateAction<boolean>>;
	accountName: string;
	setAccountName: React.Dispatch<React.SetStateAction<string>>;
	passwordParams: boolean[];
	passwordLength: number;
	setPasswordLength: React.Dispatch<React.SetStateAction<number>>;
	OnGeneratePassword: () => void;
	FlipPasswordParam: (param: number) => void;
}): JSX.Element {
	return (
		<ToolBarDialog
			open={props.shouldGenerate}
			onClose={() => {
				props.setShouldGenerate(false);
			}}
			title={"Generate A Password"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Account Name: </label>
					<input
						type="text"
						onChange={(e) => {
							props.setAccountName(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(props.accountName == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							props.accountName == "" ? "text-slate-500" : "text-slate-700"
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
								props.FlipPasswordParam(0);
							}}
							checked={props.passwordParams[0]}
						/>
						<label> Upper Case </label>
						<input
							className="inline-flex  px-3"
							type="checkbox"
							title="Numbers"
							onClick={() => {
								props.FlipPasswordParam(1);
							}}
							checked={props.passwordParams[1]}
						/>
						<label> Numbers </label>
						<input
							className="inline-flex px-3"
							type="checkbox"
							title="Special Characters"
							onClick={() => {
								props.FlipPasswordParam(2);
							}}
							checked={props.passwordParams[2]}
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
								value={props.passwordLength}
								className="slider"
								onChange={(e) => {
									props.setPasswordLength(parseInt(e.target.value.valueOf()));
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<DialogButton
				className={
					props.accountName == "" ? " cursor-not-allowed opacity-50" : ""
				}
				onClick={() => {
					props.OnGeneratePassword();
				}}
			>
				<div className="text-slate-100 text-xl py-2 px-7">Add</div>
			</DialogButton>
		</ToolBarDialog>
	);
}

function AddAccountDialog(props: {
	shouldAddAccount: boolean;
	setShouldAddAccount: React.Dispatch<React.SetStateAction<boolean>>;
	accountName: string;
	setAccountName: React.Dispatch<React.SetStateAction<string>>;
	accountPassword: string;
	setAccountPassword: React.Dispatch<React.SetStateAction<string>>;
	OnAddAccount: () => void;
}): JSX.Element {
	return (
		<ToolBarDialog
			open={props.shouldAddAccount}
			onClose={() => {
				props.setAccountName("");
				props.setAccountPassword("");
				props.setShouldAddAccount(false);
			}}
			title={"Add an Account"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Account Name: </label>
					<input
						type="text"
						onChange={(e) => {
							props.setAccountName(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(props.accountName == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							props.accountName == "" ? "text-slate-500" : "text-slate-700"
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
							props.setAccountPassword(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(props.accountPassword == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							props.accountPassword == "" ? "text-slate-500" : "text-slate-700"
						}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={
					props.accountName == "" || props.accountPassword == ""
						? " cursor-not-allowed opacity-50"
						: ""
				}
				onClick={props.OnAddAccount}
			>
				<div className="text-slate-100 text-xl py-2 px-7">Add</div>
			</DialogButton>
		</ToolBarDialog>
	);
}

function AddPhoneNumberDialog(props: {
	shouldAddPhoneNumber: boolean;
	setShouldAddPhoneNumber: React.Dispatch<React.SetStateAction<boolean>>;
	phoneNumber: string;
	setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
	VerifyNumber: (phoneNumber: string) => void;
}): JSX.Element {
	return (
		<ToolBarDialog
			open={props.shouldAddPhoneNumber}
			onClose={() => {
				props.setShouldAddPhoneNumber(false);
			}}
			title={"Generate A Password"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Phone Number: </label>
					<input
						type="text"
						onChange={(e) => {
							props.setPhoneNumber(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(props.phoneNumber == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							props.phoneNumber == "" ? "text-slate-500" : "text-slate-700"
						}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={
					props.phoneNumber == "" ? " cursor-not-allowed opacity-50" : ""
				}
				onClick={() => {
					props.VerifyNumber(props.phoneNumber);
				}}
			>
				<div className="text-slate-100 text-xl py-2 px-7">Add</div>
			</DialogButton>
		</ToolBarDialog>
	);
}

function Verify2FADialog(props: {
	shouldVerify2FA: boolean;
	setShouldVerify2FA: React.Dispatch<React.SetStateAction<boolean>>;
	code: string;
	setCode: React.Dispatch<React.SetStateAction<string>>;
	VerifyCode: (code: string) => void;
}): JSX.Element {
	return (
		<ToolBarDialog
			open={props.shouldVerify2FA}
			onClose={() => {
				props.setShouldVerify2FA(false);
			}}
			title={"Generate A Password"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Enter your 2FA code below: </label>
					<input
						type="text"
						onChange={(e) => {
							props.setCode(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(props.code == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={props.code == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={props.code == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={() => {
					props.VerifyCode(props.code);
				}}
			>
				<div className="text-slate-100 text-xl py-2 px-7">Submit</div>
			</DialogButton>
		</ToolBarDialog>
	);
}

export {
	ToolBarDialog,
	GeneratePasswordDialog,
	AddAccountDialog,
	AddPhoneNumberDialog,
	Verify2FADialog,
};
