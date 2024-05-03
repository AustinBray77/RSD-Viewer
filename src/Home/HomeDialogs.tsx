import { useState } from "react";
import BasicDialog from "../Components/Dialogs";
import { AccountData } from "../Utils/AccountData";
import { DialogButton, DialogLabel } from "../Components/Buttons";

const ChangePasswordDialog = (props: {
	accountIndex: number;
	data: AccountData[];
	setData: (val: AccountData[]) => void;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element => {
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    return (
        <BasicDialog
            open={true}
            onClose={() => {
                setPassword("");
                props.setDialog(<div></div>);
            }}
        >
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
                }}
            >
                <DialogLabel>Change</DialogLabel>
            </DialogButton>
        </BasicDialog>
    );
};

/**
 * Rewrite the following component to remove the errors
 */
const RemovePasswordDialog = (props: {
    accountIndex: number;
    data: AccountData[];
    setData: (val: AccountData[]) => void;
    setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
}): JSX.Element => {
    return (
        <BasicDialog
            open={true}
            onClose={() => {
                props.setDialog(<div></div>);
            }}
        >
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
        </BasicDialog>
    );
};