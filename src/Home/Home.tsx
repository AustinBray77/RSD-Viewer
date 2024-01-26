import React, { useState } from "react";
import OptionsColumn from "./OptionsColumn";
import AccountColumn from "./AccountColumn";
import { StatePair } from "../StatePair";
import { AccountData } from "../Services/AccountData";

function Home(props: {
	data: AccountData[]
	setData: (val: AccountData[]) => void
}): JSX.Element {
	const [dialog, setDialog] = useState(<div></div>);

	return (
		<div className="p-8 text-slate-100 overflow-y-auto max-h-[85vh]">
			<div
				className={
					"grid grid-rows-" + Math.max(props.data.length, 1) + " grid-flow-col"
				}
			>
				<AccountColumn data={props.data} />
				<OptionsColumn
					data={props.data}
					setData={props.setData}
					setDialog={setDialog}
				/>
			</div>
			{dialog}
		</div>
	);
}

export default Home;
