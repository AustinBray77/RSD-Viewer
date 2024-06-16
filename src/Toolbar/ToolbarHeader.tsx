import { AppState } from "../App";
import { RetractArrow } from "../Common/CommonElements";
import { ExportFile } from "../Services/FileHandling";
import { Get2FACode } from "../Services/TwoFactorAuth";
import { StatePair } from "../StatePair";
import { ShowDialog, ToolbarState } from "./Toolbar";

function HeaderButton(props: {
	onClick: () => void;
	title: string;
	className?: string;
}): JSX.Element {
	return (
		<div className={"inline-flex border-1 border-slate-700 content-end " + props.className!}>
			<button className="text-xl p-3" onClick={props.onClick}>
				{props.title}
			</button>
		</div>
	);
}

function ToolbarHeader(props: { state: ToolbarState, appState: AppState, has2FA: boolean }): JSX.Element {
    const { showDialog, phoneNumber, tfaCode } = props.state; 
    
    return <div className="px-8 py-5 bg-slate-700 flex content-center flex-wrap">
        <h1 className="inline-flex p-3 text-2xl" id="Title">
            RSD Password Manager
        </h1>
        <HeaderButton
            onClick={() => {
                showDialog.Set(ShowDialog.AddAccount);
            }}
            title="Add Account"
        />
        <HeaderButton
            onClick={() => {
                showDialog.Set(ShowDialog.GeneratePassword);
            }}
            title="Generate Password"
        />
        <HeaderButton
            onClick={() => {
                ExportFile(props.appState.error.Set);
            }}
            title="Export Save File"
        />
        <HeaderButton
            onClick={() => {
                showDialog.Set(ShowDialog.ImportFile);
            }}
            title="Import Save File"
        />
        <HeaderButton
            onClick={() => {
                if(props.has2FA) {
                    Get2FACode(phoneNumber.Value, props.appState.isLoading)
                        .then((res: string) => {
                            tfaCode.Set(res);
                            showDialog.Set(ShowDialog.Verify2FA);
                        })
                        .catch((err: any) => {
                            props.appState.error.Set("2FA Error: " + err as string);
                        });
                } else {
                    showDialog.Set(ShowDialog.AddPhoneNumber);
                }
            }}
            title={props.has2FA ? "Remove 2FA" : "Add 2FA"}
        />
    </div>;
}

export default ToolbarHeader;