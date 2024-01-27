import { DialogButton, DialogLabel } from "../Components/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { InputGroup } from "../Components/Forms";

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
			<InputGroup>
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
			</InputGroup>
			<DialogButton
				enabled={tfaCode.Value != ""}
				onClick={() => {
					props.VerifyCode(tfaCode.Value);
				}}
			>
				<DialogLabel>Submit</DialogLabel>
			</DialogButton>
		</ToolbarDialog>
	);
}

export default Verify2FADialog