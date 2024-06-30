import { ButtonLabel, DialogButton, OptionsButton } from "../Common/Buttons";
import { StandardHomeBox, Title } from "../Common/CommonElements";
import { StatePair, useStatePair } from "../StatePair";
import { HomeState, ShowHomeDialog } from "./Home";
import HomeDialog from "./HomeDialog";
import { DialogInput } from "../Common/Inputs";
import { useMemo } from "react";
import {
    AccountData,
    RemoveAccount,
    UpdatePassword,
} from "../Services/AccountData";
import { AppState } from "../App";

function CopyPasswordDialog(props: { state: HomeState }): JSX.Element {
    let { dialog } = props.state;

    return (
        <HomeDialog
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
    );
}

function CopyPasswordButton(props: {
    text: string;
    dialog: StatePair<ShowHomeDialog>;
}): JSX.Element {
    const onClick = () => {
        navigator.clipboard.writeText(props.text);
        props.dialog.Set(ShowHomeDialog.CopyPassword);
    };

    return <OptionsButton onClick={onClick}>Copy</OptionsButton>;
}

function ChangePasswordDialog(props: {
    state: HomeState;
    AppState: AppState;
}): JSX.Element {
    let { data, dialog, selectedAccount } = props.state;

    const password = useStatePair("");
    const confPassword = useStatePair("");

    if (selectedAccount.Value == -1 || data.length == 0) {
        return <></>;
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
                <DialogInput
                    label="New Password: "
                    value={password}
                    className="my-5"
                    required={true}
                    type="password"
                />
                <DialogInput
                    label="Confirm Password: "
                    value={confPassword}
                    className="my-5"
                    required={true}
                    type="password"
                    bounds={[
                        [
                            password.Value != confPassword.Value,
                            "Passwords do not match",
                        ],
                    ]}
                />
            </div>
            <DialogButton
                className={
                    password.Value == "" ||
                    confPassword.Value == "" ||
                    password.Value != confPassword.Value
                        ? " cursor-not-allowed opacity-50"
                        : ""
                }
                onClick={() => {
                    if (
                        password.Value == "" ||
                        confPassword.Value == "" ||
                        password.Value != confPassword.Value
                    ) {
                        return;
                    }

                    UpdatePassword(
                        selectedAccount.Value,
                        password.Value,
                        props.AppState
                    );

                    password.Set("");
                    confPassword.Set("");
                    dialog.Set(ShowHomeDialog.None);
                }}
            >
                <ButtonLabel>Change</ButtonLabel>
            </DialogButton>
        </HomeDialog>
    );
}

function ChangePasswordButton(props: {
    state: HomeState;
    accountIndex: number;
}): JSX.Element {
    let { dialog, selectedAccount } = props.state;

    const onClick = () => {
        selectedAccount.Set(props.accountIndex);
        dialog.Set(ShowHomeDialog.ChangePassword);
    };

    return <OptionsButton onClick={onClick}>Change</OptionsButton>;
}

function RemovePasswordDialog(props: {
    state: HomeState;
    AppState: AppState;
}): JSX.Element {
    let { data, dialog, selectedAccount } = props.state;

    if (selectedAccount.Value == -1 || data.length == 0) {
        return <></>;
    }

    return (
        <HomeDialog
            dialogTag={ShowHomeDialog.RemovePassword}
            onClose={() => {
                dialog.Set(ShowHomeDialog.None);
            }}
            showDialog={dialog}
            title={
                "Are you sure you want to remove the password for " +
                data[selectedAccount.Value].Name +
                "?"
            }
        >
            <div className="my-5" />
            <DialogButton
                onClick={() => {
                    RemoveAccount(selectedAccount.Value, props.AppState);
                    selectedAccount.Set(-1);
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
}

function RemovePasswordButton(props: {
    state: HomeState;
    accountIndex: number;
}): JSX.Element {
    let { data, dialog, selectedAccount } = props.state;

    const onClick = () => {
        selectedAccount.Set(props.accountIndex);
        /*console.log(
			`Remove Clicked for account: ${data[selectedAccount.Value].Name}`
		);*/
        dialog.Set(ShowHomeDialog.RemovePassword);
    };

    return <OptionsButton onClick={onClick}>Remove</OptionsButton>;
}

function OptionsButtons(props: {
    account: AccountData;
    index: number;
    state: HomeState;
}): JSX.Element {
    const { account, index, state } = props;

    return (
        <StandardHomeBox className="flex justify-center w-1/3 min-w-96">
            <CopyPasswordButton text={account.Password} dialog={state.dialog} />
            <ChangePasswordButton state={state} accountIndex={index} />
            <RemovePasswordButton state={state} accountIndex={index} />
        </StandardHomeBox>
    );
}

export {
    OptionsButtons,
    CopyPasswordDialog,
    ChangePasswordDialog,
    RemovePasswordDialog,
};
