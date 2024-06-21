import React, { useMemo, useState } from "react";
import { OptionsColumn, CopyPasswordDialog, ChangePasswordDialog, RemovePasswordDialog, CopyPasswordButton, ChangePasswordButton, RemovePasswordButton } from "./OptionsColumn";
import AccountColumn from "./AccountColumn";
import { StatePair, useStatePair } from "../StatePair";
import { AccountData } from "../Services/AccountData";
import SideButtons from "./SideButtons";
import { SmallIcon, StandardHomeBox, Title } from "../Common/CommonElements";

enum ShowHomeDialog {
	None,
	CopyPassword,
	ChangePassword,
	RemovePassword
}

type HomeState = {
	data: AccountData[]
	setData: (val: AccountData[]) => void
	dialog: StatePair<ShowHomeDialog>
	selectedAccount: StatePair<number>
}

const GenerateAccounts = (data: AccountData[]) => {
	console.log(data);
	
	return data.map((account) => {
		console.log(account);

		return <li>
			
		</li>
	})
}

const GenerateRows = (state: HomeState) => {
	const { data, dialog } = state;
	
	return data.map((account, i) => {
		if(account.IsSpecial) return <></>;

		let x = i;

		return <div className="flex">
			<div className="w-5 min-w-fit p-3 content-center" onClick={() => {}}>
                <SmallIcon src="/arrow-down-light.png" className="rotate-180 opacity-50 mb-4" />
                <SmallIcon src="/arrow-down-light.png" className="opacity-50" />
            </div>
			<div className="w-[85vw] min-w-fit border-2 border-slate-600/[.1]">
				<div className="flex">
					<StandardHomeBox className="w-2/3 min-w-96">
						<div className="px-5">
							{account.Name}
						</div>
					</StandardHomeBox>
					<StandardHomeBox className="flex justify-center w-1/3 min-w-96">
						<CopyPasswordButton
							text={account.Password}
							dialog={dialog}
						/>
						<ChangePasswordButton state={state} accountIndex={x} />
						<RemovePasswordButton state={state} accountIndex={x} />
					</StandardHomeBox>
				</div>
			</div>
		</div>
	});
};

function Home(props: {
	data: AccountData[]
	setData: (val: AccountData[]) => void
}): JSX.Element {
	const dialog = useStatePair(ShowHomeDialog.None);

	let filteredData = props.data.filter(account => !account.IsSpecial);

	let state = {
		data: props.data,
		setData: props.setData,
		dialog: dialog,
		selectedAccount: useStatePair(-1)
	}

	if (filteredData.length == 0) {
		return <div className="p-8 text-slate-100 overflow-y-auto content-center flex justify-center">
				<h1 className="text-5xl">No Accounts Yet</h1>
			</div>
	}

	let rows = GenerateRows(state);

	rows.unshift(
		<div className="flex">
			<div className="w-5 min-w-fit p-3">
				<SmallIcon src="/arrow-down-light.png" className="rotate-180 opacity-0 mb-4" />
				<SmallIcon src="/arrow-down-light.png" className="opacity-0" />
			</div>
			<div className="w-[85vw] min-w-fit border-2 border-slate-600/[.1]">
				<div className="flex">
					<div className="w-2/3 min-w-96">
						<Title className="flex justify-center">
							Accounts
						</Title>
					</div>
					<div className="w-1/3 min-w-96">
						<Title className="flex justify-center">
							Options
						</Title>
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="text-slate-100 overflow-y-auto h-[100vh]">
			<div
				className={
					"grid grid-cols-1 grid-flow-row w-screen p-8"
				}
			>
				{rows}
			</div>
			<CopyPasswordDialog state={state} />
			<ChangePasswordDialog state={state} />
			<RemovePasswordDialog state={state} />
		</div>
	);
}

export { Home, HomeState, ShowHomeDialog };
