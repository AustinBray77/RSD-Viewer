import { AppState } from "../App";
import { ShowDialog, ToolbarState } from "../Toolbar/Toolbar";

class AccountData {
	Name: string;
	Password: string;
	IsSpecial: boolean;

	constructor(name: string, password: string) {
		this.Name = name;
		this.Password = password;
		this.IsSpecial = false;
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

const AddAccountHandler = (account: AccountData, app: AppState) => {
	if (account.isEmpty()) {
		return;
	}

	console.log("Adding Account...");

	let newData = [...app.data];

	newData.push(account);

	app.setData(newData);
}

const GetPhoneNumberFromData = (data: AccountData[]): string => {
	for(let i = 0; i < data.length; i++) {
		if(data[i].IsSpecial && data[i].Name == "Phone_Number") {
			return data[i].Password;
		}
	}

	return "";
}

function AddPhoneNumber (phoneNumber: string,  AppState: AppState):void {
	let phoneNumberAccount = new AccountData("Phone_Number", phoneNumber);
	phoneNumberAccount.IsSpecial = true;
	AppState.data.push(phoneNumberAccount);
	AppState.setData(AppState.data);
	AppState.error.Set("Phone number added successfully");
}

export { AccountData, AddAccountHandler, GetPhoneNumberFromData, AddPhoneNumber };

