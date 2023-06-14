class AccountData {
	Name: string;
	Password: string;

	constructor(name: string, password: string) {
		this.Name = name;
		this.Password = password;
	}

	static arrayFromJSON(jsonString: string): AccountData[] {
		return JSON.parse(jsonString);
	}

	static arrayToJSON(data: AccountData[]): string {
		return JSON.stringify(data);
	}
}

export default AccountData;
