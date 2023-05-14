import "./Home.css";

function AccountColumn(): JSX.Element {
	return (
		<div id="AccountColumn" className="border-1 border-slate-700">
			<h3 className="text-2xl p-3">Account</h3>
		</div>
	);
}

function OptionsColumn(): JSX.Element {
	return (
		<div id="OptionsColumn" className="border-1 border-slate-700">
			<h3 className="text-2xl p-3">Options</h3>
		</div>
	);
}

function Home() {
	return (
		<div className="p-8 text-lg bg-slate-900 text-slate-100">
			<h1 className="m-4 text-5xl" id="Title">
				RSD Password Manager
			</h1>
			<div className="m-4">
				<div className="inline-flex">
					<AccountColumn />
				</div>
				<div className="inline-flex">
					<OptionsColumn />
				</div>
			</div>
		</div>
	);
}

export default Home;
