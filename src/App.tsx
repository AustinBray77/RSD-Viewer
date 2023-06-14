import Home from "./Home/Home";
import Toolbar from "./Toolbar";
import React, { useState } from "react";
import { invoke } from "@tauri-apps/api";
import AccountData from "./AccountData";
import { Dialog } from "@mui/material";
import { DialogButton } from "./Buttons";
import { exit } from "@tauri-apps/api/process";

function PasswordDialog(props: {
	password: string;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
	onClose: any;
}) {
	const [input, setInput] = useState("");

	return (
		<Dialog
			open={props.password == ""}
			onClose={() => {
				props.setPassword(input);
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
						props.setPassword(input);
						props.onClose(input);
					}}
				>
					<div className="text-slate-100 text-xl py-2 px-7">Ok</div>
				</DialogButton>
			</div>
		</Dialog>
	);
}

function App() {
	const [data, setData] = useState(new Array<AccountData>());
	const [error, setError] = useState("");
	const [password, setPassword] = useState("");

	const getData = (password: string): void => {
		invoke("get_data", { password: password })
			.then((res) => {
				setPassword(password);

				if ((res as string) != "") {
					setData(AccountData.arrayFromJSON(res as string));
				}
			})
			.catch((err: string) => {
				setError("FATAL ERROR (password is likely incorrect): " + err);
			});
	};

	const sendSetData = (val: AccountData[]): void => {
		invoke("save_data", {
			data: AccountData.arrayToJSON(val),
			password: password,
		})
			.then((res) => {
				setData(val);
			})
			.catch((err) => {
				setError(err);
			});
	};

	return (
		<div className="bg-slate-900 text-slate-100 min-h-screen">
			<Toolbar data={data} setData={sendSetData} />
			<Home data={data} setData={sendSetData} />
			<Dialog
				id="Error Dialog"
				open={error != ""}
				onClose={() => {
					if (error.substring(0, 5) == "FATAL") {
						exit(-1);
					}

					setError("");
				}}
			>
				<div className="p-10 bg-slate-800">
					<h2 className="text-3xl text-slate-100 m-5">{error}</h2>
					<DialogButton
						onClick={() => {
							if (error.substring(0, 5) == "FATAL") {
								exit(-1);
							}

							setError("");
						}}
						className="p-5"
					>
						Ok
					</DialogButton>
				</div>
			</Dialog>
			<PasswordDialog
				password={password}
				setPassword={setPassword}
				onClose={getData}
			/>
		</div>
	);
}

export default App;
