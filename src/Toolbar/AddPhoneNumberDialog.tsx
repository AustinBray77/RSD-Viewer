import { ButtonLabel, DialogButton } from "../Common/Buttons";
import ToolbarDialog from "./ToolbarDialog";
import { ShowDialog, ToolbarState } from "./Toolbar";
import { AppState } from "../App";
import { useState } from "react";
import { Get2FACode } from "../Services/TwoFactorAuth";
import { DialogInput, DropdownFromList } from "../Common/Inputs";
import { useStatePair } from "../StatePair";

function AddPhoneNumberDialog(props: {
    ToolbarState: ToolbarState;
    AppState: AppState;
}): JSX.Element {
    const { showDialog, phoneNumber, tfaCode } = props.ToolbarState;

    const [countryCode, setCountryCode] = useState("+1");
    const inputtedNumber = useStatePair("");
    const countryCodes = ["+61", "+1", "+64", "+27", "+44", "+1", "NA"];
    const countryIcons = [
        "aus.jpg",
        "canada.jpg",
        "nzl.jpg",
        "saf.jpg",
        "uk.png",
        "usa.png",
        "...",
    ];

    const ClearUsedValues = () => {
        tfaCode.Set("");
        inputtedNumber.Set("");
        showDialog.Set(ShowDialog.None);
    };

    const TryAddInputtedPhoneNumber = () => {
        if (inputtedNumber.Value == "") return;

        let updatedNumber =
            countryCode != "NA"
                ? countryCode + inputtedNumber.Value
                : inputtedNumber.Value;

        Get2FACode(updatedNumber, props.AppState.isLoading)
            .then((res: string) => {
                phoneNumber.Set(updatedNumber);
                tfaCode.Set(res);
                showDialog.Set(ShowDialog.Verify2FA);
                inputtedNumber.Set("");
            })
            .catch((err: any) => {
                ClearUsedValues();
                props.AppState.error.Set(("2FA Error: " + err) as string);
            });
    };

    return (
        <ToolbarDialog
            dialogTag={ShowDialog.AddPhoneNumber}
            showDialog={showDialog}
            title={"Enter Your Phone Number"}
            onClose={() => {
                ClearUsedValues();
            }}
        >
            <div id="input-group" className="px-10 my-5">
                <label className="text-xl">Phone Number: </label>
                <br />
                <div className="flex items-start">
                    <DropdownFromList
                        items={countryCodes}
                        icons={countryIcons}
                        startingIndex={1}
                        onChange={(index: number) => {
                            setCountryCode(countryCodes[index]);
                        }}
                        className="mr-4"
                    />
                    <DialogInput value={inputtedNumber} required={true} />
                </div>
            </div>
            <DialogButton
                className={
                    inputtedNumber.Value == ""
                        ? " cursor-not-allowed opacity-50"
                        : ""
                }
                onClick={TryAddInputtedPhoneNumber}
            >
                <ButtonLabel>Add</ButtonLabel>
            </DialogButton>
        </ToolbarDialog>
    );
}

export default AddPhoneNumberDialog;
