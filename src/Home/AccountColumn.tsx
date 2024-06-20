import { AccountData } from "../Services/AccountData";
import { StandardHomeBox, Title } from "../Common/CommonElements";
import { useMemo } from "react";

export default function AccountColumn(props: {
	data: AccountData[];
}): JSX.Element {
	const GenerateAccountRows = (data: AccountData[]) => {
		console.log(data);
		
		return data.map((account) => {
			console.log(account);

			return <li>
				<StandardHomeBox>
					<div className="h-[3.5rem] leading-[3.5rem] px-5">
						{account.Name}
					</div>
				</StandardHomeBox>
			</li>
		})
	}
	
	let accountList: JSX.Element[] = useMemo(() => GenerateAccountRows(props.data), [props.data]);

	return (
		<div id="AccountColumn" className="w-2/3 min-w-1/2">
			<Title>Accounts</Title>
			<div className="text-xl">
				<ul>
					{accountList}
				</ul>
			</div>
		</div>
	);
}
