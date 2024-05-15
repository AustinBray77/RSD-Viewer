import { AccountData } from "../Services/AccountData";
import { StandardHomeBox } from "../Common/CommonElements";

export default function AccountColumn(props: {
	data: AccountData[];
}): JSX.Element {
	let accountList: JSX.Element[] = [];

	for (let i = 0; i < props.data.length; i++) {
		accountList.push(
			<li>
				<StandardHomeBox>
					<div className="p-3 border-2 border-slate-700/[.1]">
						{props.data[i].Name}
					</div>
				</StandardHomeBox>
			</li>
		);
	}

	return (
		<div id="AccountColumn" className="">
			<h3 className="text-2xl px-5">Accounts</h3>
			<div className="text-xl px-5">
				{accountList.length > 0 ? (
					<ul>{accountList}</ul>
				) : (
					<h4>No Accounts Yet</h4>
				)}
			</div>
		</div>
	);
}
