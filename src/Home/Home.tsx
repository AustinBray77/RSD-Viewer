import React, { useMemo, useState } from "react";
import {
    CopyPasswordDialog,
    ChangePasswordDialog,
    RemovePasswordDialog,
    OptionsButtons,
} from "./OptionsColumn";
import { StatePair, useStatePair } from "../StatePair";
import { AccountData } from "../Services/AccountData";
import {
    DropdownDark,
    DropdownFromList,
    SmallIcon,
    Title,
} from "../Common/CommonElements";
import RowButtons from "./SideButtons";
import AccountDisplay from "./AccountColumn";
import { AppState } from "../App";

enum ShowHomeDialog {
    None,
    CopyPassword,
    ChangePassword,
    RemovePassword,
}

type HomeState = {
    data: AccountData[];
    dialog: StatePair<ShowHomeDialog>;
    selectedAccount: StatePair<number>;
};

const HomeRow = (props: {
    account: AccountData;
    index: number;
    state: HomeState;
    length: number;
    AppState: AppState;
    swapIndex: StatePair<[number, number]>;
}) => {
    const { account, index, state, length, swapIndex } = props;
    const isHovering = useStatePair(false);

    let borderString = "border-x-2 border-slate-600/[.1]";

    if (isHovering.Value) {
        borderString += " border-x-slate-400";
    }

    if (index == length - 1) {
        borderString += " border-b-2";
    }

    let animationString = "";

    if (swapIndex.Value[0] == index) {
        animationString = "swap-down-animation";
    } else if (swapIndex.Value[1] == index) {
        animationString = "swap-up-animation";
    }

    return (
        <div
            className={"flex place-content-center " + animationString}
            onMouseEnter={() => isHovering.Set(true)}
            onMouseLeave={() => isHovering.Set(false)}
        >
            <RowButtons
                isHovering={isHovering.Value}
                accountIndex={index}
                AppState={props.AppState}
                swapIndex={props.swapIndex}
            />
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

const GenerateRows = (
    state: HomeState,
    AppState: AppState,
    swapIndex: StatePair<[number, number]>
) => {
    const { data } = state;

    return data.map((account, index) => {
        if (account.IsSpecial) return <></>;

        return (
            <HomeRow
                account={account}
                index={index}
                state={state}
                length={data.length}
                AppState={AppState}
                swapIndex={swapIndex}
            />
        );
    });
};

const HomeHeader = (props: { isEmpty: boolean }) => {
    if (props.isEmpty) {
        return (
            <div className="p-8 text-slate-100 overflow-y-auto content-center flex justify-center">
                <h1 className="text-5xl">No Accounts Yet</h1>
            </div>
        );
    }

    return (
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
};

function SortButtons(props: { AppState: AppState }): JSX.Element {
    return (
        <div className="flex justify-center">
            <DropdownFromList
                items={["Default", "Account Name"]}
                startingIndex={0}
                onChange={(index) => {}}
                scheme={DropdownDark}
            />
        </div>
    );
}

function Home(props: { AppState: AppState }): JSX.Element {
    const { data } = props.AppState;
    const dialog = useStatePair(ShowHomeDialog.None);
    const swapIndexs = useStatePair<[number, number]>([-1, -1]);

    let filteredData = data.filter((account) => !account.IsSpecial);

    let state = {
        data: data,
        dialog: dialog,
        selectedAccount: useStatePair(-1),
    };

    let rows = useMemo(() => {
        let output = GenerateRows(state, props.AppState, swapIndexs);
        output.unshift(<HomeHeader isEmpty={filteredData.length == 0} />);
        return output;
    }, [data.length, swapIndexs.Value]);

    return (
        <div className="flex justify-center">
            <div className="text-slate-100 overflow-y-auto h-screen pt-[2em]">
                <SortButtons AppState={props.AppState} />
                <div className={"grid grid-cols-1 grid-flow-row w-[95vw] p-8"}>
                    {rows}
                </div>
                <CopyPasswordDialog state={state} />
                <ChangePasswordDialog state={state} AppState={props.AppState} />
                <RemovePasswordDialog state={state} AppState={props.AppState} />
            </div>
        </div>
    );
}

export { Home, HomeState, ShowHomeDialog };
