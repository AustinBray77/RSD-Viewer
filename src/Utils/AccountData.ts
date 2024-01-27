import { AppState } from "../App";
import { ToolbarState } from "../Toolbar/Toolbar";

class AccountData {
	Name: string;
	Password: string;

	constructor(name: string, password: string) {
		this.Name = name;
		this.Password = password;
	}

	isEmpty(): boolean {
		return this.Password == "" || this.Name == "";
	}

	static arrayFromJSON(jsonString: string): AccountData[] {
		return JSON.parse(jsonString);
	}

	static arrayToJSON(data: AccountData[]): string {
		return JSON.stringify(data);
	}
}

const AddAccountHandler = (state: ToolbarState, app: AppState) => {
	if (state.account.Value.isEmpty()) {
		return;
	}

	console.log("Adding Account...");

	let newData = [...app.data];

	newData.push(state.account.Value);

	app.setData(newData);
}

export { AccountData, AddAccountHandler };

