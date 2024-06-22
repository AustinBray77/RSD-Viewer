import React, { useMemo, useState } from "react";
import {
    CopyPasswordDialog,
    ChangePasswordDialog,
    RemovePasswordDialog,
    OptionsButtons,
} from "./OptionsColumn";
import { StatePair, useStatePair } from "../StatePair";
import { AccountData } from "../Services/AccountData";
import { SmallIcon, StandardHomeBox, Title } from "../Common/CommonElements";
import RowButtons from "./SideButtons";
import AccountDisplay from "./AccountColumn";

enum ShowHomeDialog {
    None,
    CopyPassword,
    ChangePassword,
    RemovePassword,
}

type HomeState = {
    data: AccountData[];
    setData: (val: AccountData[]) => void;
    dialog: StatePair<ShowHomeDialog>;
    selectedAccount: StatePair<number>;
};

const HomeRow = (props: {
    account: AccountData;
    index: number;
    state: HomeState;
    length: number;
}) => {
    const { account, index, state, length } = props;
    const isHovering = useStatePair(false);

    let borderString = "border-x-2 border-slate-600/[.1]";

    if (isHovering.Value) {
        borderString += " border-x-slate-400";
    }

    if (index == length - 1) {
        borderString += " border-b-2";
    }

    return (
        <div
            className="flex place-content-center"
            onMouseEnter={() => isHovering.Set(true)}
            onMouseLeave={() => isHovering.Set(false)}
        >
            <RowButtons isHovering={isHovering.Value} />
            <div
                className={
                    "w-[90vw] min-w-fit transition-border duration-300 " +
                    borderString
                }
            >
                <div className="flex">
                    <AccountDisplay account={account} />
                    <OptionsButtons
                        account={account}
                        index={index}
                        state={state}
                    />
                </div>
            </div>
        </div>
    );
};

const GenerateRows = (state: HomeState) => {
    const { data } = state;

    return data.map((account, index) => {
        if (account.IsSpecial) return <></>;

        return (
            <HomeRow
                account={account}
                index={index}
                state={state}
                length={data.length}
            />
        );
    });
};

function Home(props: {
    data: AccountData[];
    setData: (val: AccountData[]) => void;
}): JSX.Element {
    const dialog = useStatePair(ShowHomeDialog.None);

    let filteredData = props.data.filter((account) => !account.IsSpecial);

    let state = {
        data: props.data,
        setData: props.setData,
        dialog: dialog,
        selectedAccount: useStatePair(-1),
    };

    if (filteredData.length == 0) {
        return (
            <div className="p-8 text-slate-100 overflow-y-auto content-center flex justify-center">
                <h1 className="text-5xl">No Accounts Yet</h1>
            </div>
        );
    }

    let rows = GenerateRows(state);

    rows.unshift(
        <div className="flex place-content-center">
            <div className="w-5 min-w-fit p-3">
                <SmallIcon
                    src="/arrow-down-light.png"
                    className="rotate-180 opacity-0 mb-4"
                />
                <SmallIcon src="/arrow-down-light.png" className="opacity-0" />
            </div>
            <div className="w-[90vw] min-w-fit border-x-2 border-t-2 border-slate-600/[.1]">
                <div className="flex">
                    <div className="w-2/3 min-w-96">
                        <Title className="flex justify-center leading-[3rem]">
                            Accounts
                        </Title>
                    </div>
                    <div className="w-1/3 min-w-96">
                        <Title className="flex justify-center leading-[3rem]">
                            Options
                        </Title>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex justify-center">
            <div className="text-slate-100 overflow-y-auto h-screen">
                <div className={"grid grid-cols-1 grid-flow-row w-[95vw] p-8"}>
                    {rows}
                </div>
                <CopyPasswordDialog state={state} />
                <ChangePasswordDialog state={state} />
                <RemovePasswordDialog state={state} />
            </div>
        </div>
    );
}

export { Home, HomeState, ShowHomeDialog };
