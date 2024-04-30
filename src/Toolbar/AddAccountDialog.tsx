import { ShowDialog, ToolbarState } from "./Toolbar";
import { ButtonLabel, DialogButton } from "../Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { AppState } from "../App";
import { AccountData, AddAccountHandler } from "../Services/AccountData";
import { ClearToolbar } from "../Services/ClearToolbar";

function AddAccountDialog(props: {
	ToolbarState: ToolbarState,
    AppState: AppState
}): JSX.Element {
	const {
		showDialog,
		account
	} = props.ToolbarState;

	return (
		<ToolbarDialog
			open={showDialog.Value == ShowDialog.AddAccount}
			onClose={() => {
				ClearToolbar(props.ToolbarState);
				showDialog.Set(ShowDialog.None)
			}}
			title={"Add an Account"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Account Name: </label>
					<input
						type="text"
						onChange={(e) => {
							account.Set(new AccountData(e.target.value, account.Value.Password))
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(account.Value.Name == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							account.Value.Name == "" ? "text-slate-500" : "text-slate-700"
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
							account.Set(new AccountData(account.Value.Name, e.target.value));
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(account.Value.Password == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={
							account.Value.Password == "" ? "text-slate-500" : "text-slate-700"
						}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={
					account.Value.Name == "" || account.Value.Password == ""
						? " cursor-not-allowed opacity-50"
						: ""
				}
				onClick={
					() => { 
						AddAccountHandler(props.ToolbarState, props.AppState);
						ClearToolbar(props.ToolbarState);
						showDialog.Set(ShowDialog.None) 
					}}
			>
				<ButtonLabel>Add</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default AddAccountDialog