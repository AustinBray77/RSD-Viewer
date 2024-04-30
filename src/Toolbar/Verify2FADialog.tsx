import { ButtonLabel, DialogButton } from "../Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";

function Verify2FADialog(props: {
	ToolbarState: ToolbarState
	VerifyCode: (code: string) => void;
}): JSX.Element {
	const {
		showDialog,
		tfaCode
	} = props.ToolbarState;
	
	return (
		<ToolbarDialog
			open={showDialog.Value == ShowDialog.Verify2FA}
			onClose={() => {
				showDialog.Set(ShowDialog.None)
			}}
			title={"Generate A Password"}
		>
			<div id="input-group" className="px-10">
				<div className="my-5">
					<label className="text-xl">Enter your 2FA code below: </label>
					<input
						type="text"
						onChange={(e) => {
							tfaCode.Set(e.target.value);
						}}
						className={
							"focus:outline-none bg-slate-700 border-2 rounded " +
							(tfaCode.Value == ""
								? "border-rose-500"
								: "focus:border-slate-600 hover:border-slate-600/[.50] border-slate-700")
						}
					/>
					<br />
					<label
						className={tfaCode.Value == "" ? "text-slate-500" : "text-slate-700"}
					>
						This field is required
					</label>
				</div>
			</div>
			<DialogButton
				className={tfaCode.Value == "" ? " cursor-not-allowed opacity-50" : ""}
				onClick={() => {
					props.VerifyCode(tfaCode.Value);
				}}
			>
				<ButtonLabel>Submit</ButtonLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default Verify2FADialog