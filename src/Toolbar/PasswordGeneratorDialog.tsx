import { ButtonLabel, DialogButton } from "../Common/Buttons";
import {
    AddRangeToSet,
    ArrayRange,
    CollapsableRandomArray,
} from "../Services/Math";
import { AccountData, AddAccountHandler } from "../Services/AccountData";
import { useStatePair } from "../StatePair";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { DialogInput } from "../Common/Inputs";
import { AppState } from "../App";
import { ToolTip } from "../Common/CommonElements";
import React from "react";

type PasswordParams = {
    hasUpperCase: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
};

const GeneratePassword = (
    passwordParams: PasswordParams,
    passwordLength: number
): string => {
    /*if (state.account.Value.Name == "") {
		return;
	}*/
    console.log("Generating pass");

    let min: number;

    if (passwordParams.hasSpecialChars) {
        min = 33;
    } else if (passwordParams.hasNumbers) {
        min = 48;
    } else if (passwordParams.hasUpperCase) {
        min = 65;
    } else {
        min = 97;
    }

    let max = passwordParams.hasSpecialChars ? 126 : 122;

    let exclusions: Set<number> = new Set();

    if (
        !passwordParams.hasUpperCase &&
        (passwordParams.hasSpecialChars || passwordParams.hasNumbers)
    ) {
        exclusions = AddRangeToSet(65, 90, exclusions);
    }

    if (!passwordParams.hasNumbers && passwordParams.hasSpecialChars) {
        exclusions = AddRangeToSet(48, 57, exclusions);
    }

    if (!passwordParams.hasSpecialChars) {
        if (passwordParams.hasNumbers) {
            exclusions = AddRangeToSet(58, 64, exclusions);
            exclusions = AddRangeToSet(91, 96, exclusions);
        } else if (passwordParams.hasUpperCase) {
            exclusions = AddRangeToSet(91, 96, exclusions);
        }
    }

    console.log(exclusions);

    let asciiCharacters = CollapsableRandomArray(
        min,
        max,
        new Set(exclusions),
        passwordLength
    );

    let newPass = asciiCharacters.map((i) => String.fromCharCode(i)).join("");

    return newPass;
};

/*const FlipPasswordParam = (param: number, passwordParams: StatePair<PasswordParams>) => {
	let newParams = passwordParams.Value;
	
	switch(param) {
		case 0:
			newParams.hasUpperCase = !newParams.hasUpperCase;
			break;
		case 1: 
			newParams.hasNumbers = !newParams.hasNumbers;
			break;
		case 2: 
			newParams.hasSpecialChars = !newParams.hasSpecialChars;
			break;
	}

	console.log(passwordParams.Value.hasUpperCase + " " + passwordParams.Value.hasNumbers + " " + passwordParams.Value.hasSpecialChars);

	passwordParams.Set(newParams);
};*/

function GeneratePasswordDialog(props: {
    ToolbarState: ToolbarState;
    AppState: AppState;
}): JSX.Element {
    const { showDialog } = props.ToolbarState;

    const passwordParams = useStatePair<PasswordParams>({
        hasUpperCase: true,
        hasNumbers: true,
        hasSpecialChars: true,
    });
    const passwordLength = useStatePair(8);
    const inputName = useStatePair("");
    const hoveringOnSlider = useStatePair(false);
    const dialogRef = React.useRef<HTMLDivElement>(null);

    const tooltipOffset: [number, number] = dialogRef.current
        ? [
              dialogRef.current.getBoundingClientRect().x,
              dialogRef.current.getBoundingClientRect().y,
          ]
        : [0, 0];

    return (
        <ToolbarDialog
            dialogTag={ShowDialog.GeneratePassword}
            showDialog={showDialog}
            title={"Generate A Password"}
            onClose={() => {
                inputName.Set("");
            }}
        >
            {hoveringOnSlider.Value ? (
                <ToolTip offset={tooltipOffset}>
                    {passwordLength.Value.toString()}
                </ToolTip>
            ) : (
                <></>
            )}
            <div id="input-group" className="px-10" ref={dialogRef}>
                <DialogInput
                    label="Account Name: "
                    value={inputName}
                    required={true}
                    className="my-5"
                />
                <div className="my-5">
                    <label className="text-xl">Password Parameters: </label>
                    <div>
                        <input
                            className="inline-flex  px-3"
                            type="checkbox"
                            title="Upper Case"
                            onClick={() => {
                                passwordParams.Set({
                                    hasUpperCase:
                                        !passwordParams.Value.hasUpperCase,
                                    hasNumbers: passwordParams.Value.hasNumbers,
                                    hasSpecialChars:
                                        passwordParams.Value.hasSpecialChars,
                                });
                                //FlipPasswordParam(0, passwordParams);
                            }}
                            checked={passwordParams.Value.hasUpperCase}
                        />
                        <label> Upper Case </label>
                        <input
                            className="inline-flex  px-3"
                            type="checkbox"
                            title="Numbers"
                            onClick={() => {
                                passwordParams.Set({
                                    hasUpperCase:
                                        passwordParams.Value.hasUpperCase,
                                    hasNumbers:
                                        !passwordParams.Value.hasNumbers,
                                    hasSpecialChars:
                                        passwordParams.Value.hasSpecialChars,
                                });
                                //FlipPasswordParam(1, passwordParams);
                            }}
                            checked={passwordParams.Value.hasNumbers}
                        />
                        <label> Numbers </label>
                        <input
                            className="inline-flex px-3"
                            type="checkbox"
                            title="Special Characters"
                            onClick={() => {
                                passwordParams.Set({
                                    hasUpperCase:
                                        passwordParams.Value.hasUpperCase,
                                    hasNumbers: passwordParams.Value.hasNumbers,
                                    hasSpecialChars:
                                        !passwordParams.Value.hasSpecialChars,
                                });
                                //FlipPasswordParam(2, passwordParams);
                            }}
                            checked={passwordParams.Value.hasSpecialChars}
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
                                value={passwordLength.Value}
                                className="slider"
                                onChange={(e) => {
                                    passwordLength.Set(
                                        parseInt(e.target.value.valueOf())
                                    );
                                    //props.AppState.tooltip.Set(passwordLength.Value.toString());
                                }}
                                onMouseEnter={() => {
                                    hoveringOnSlider.Set(true);
                                }}
                                onMouseLeave={() => {
                                    hoveringOnSlider.Set(false);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <DialogButton
                className={
                    inputName.Value == ""
                        ? " cursor-not-allowed opacity-50"
                        : ""
                }
                onClick={() => {
                    if (inputName.Value == "") return;

                    let pass = GeneratePassword(
                        passwordParams.Value,
                        passwordLength.Value
                    );

                    AddAccountHandler(inputName.Value, pass, props.AppState);

                    inputName.Set("");
                    showDialog.Set(ShowDialog.None);
                }}
            >
                <ButtonLabel>Add</ButtonLabel>
            </DialogButton>
        </ToolbarDialog>
    );
}

export default GeneratePasswordDialog;
