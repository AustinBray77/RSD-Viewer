import { AccountData } from "../Services/AccountData";
import { StandardHomeBox, Title } from "../Common/CommonElements";

export default function AccountColumn(props: {
	data: AccountData[];
}): JSX.Element {
	let accountList: JSX.Element[] = [];

	for (let i = 0; i < props.data.length; i++) {
		accountList.push(
			<li>
				<StandardHomeBox>
					<div className="h-[3.5rem] px-5 content-center">
						{props.data[i].Name}
					</div>
				</StandardHomeBox>
			</li>
		);
	}

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
