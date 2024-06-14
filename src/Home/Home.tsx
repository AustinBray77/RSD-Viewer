import React, { useState } from "react";
import { OptionsColumn, CopyPasswordDialog, ChangePasswordDialog, RemovePasswordDialog } from "./OptionsColumn";
import AccountColumn from "./AccountColumn";
import { StatePair, useStatePair } from "../StatePair";
import { AccountData } from "../Services/AccountData";

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

	return (
		<div className="p-8 text-slate-100 overflow-y-auto max-h-[85vh]">
			<div
				className={
					"flex columns-2 border-2 border-slate-600/[.1] min-w-fit"
				}
			>
				<AccountColumn data={filteredData} />
				<OptionsColumn state={state} />
			</div>
			<CopyPasswordDialog state={state} />
			<ChangePasswordDialog state={state} />
			<RemovePasswordDialog state={state} />
		</div>
	);
}

export { Home, HomeState, ShowHomeDialog };
