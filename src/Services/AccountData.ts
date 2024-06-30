import { AppState } from "../App";

class AccountData {
    Name: string;
    Password: string;
    IsSpecial: boolean;
    Position: number;

    constructor(
        name: string,
        password: string,
        position: number,
        isSpecial?: boolean
    ) {
        this.Name = name;
        this.Password = password;
        this.IsSpecial = isSpecial ?? false;
        this.Position = position;
    }

    isEmpty(): boolean {
        return this.Password == "" || this.Name == "";
    }

    equals(accountData: AccountData) {
        return (
            this.Name == accountData.Name &&
            this.Password == accountData.Password &&
            this.IsSpecial == accountData.IsSpecial &&
            this.Position == accountData.Position
        );
    }

    static fromJSONMap(
        mapObject: Map<String, String>,
        index: number
    ): AccountData {
        let name = (mapObject.get("Name") as string) ?? "";
        let password = (mapObject.get("Password") as string) ?? "";
        let position = (mapObject.get("Position") as string) ?? index;
        let IsSpecial = mapObject.get("IsSpecial") == "true";

        let account = new AccountData(name, password, parseInt(position));

        account.IsSpecial = IsSpecial;

        return account;
    }

    static arrayFromJSON(jsonString: string): AccountData[] {
        let accountMaps: Map<String, String>[] = (
            JSON.parse(jsonString) as Object[]
        ).map((obj: Object) => {
            return new Map(Object.entries(obj));
        });

        return accountMaps.map(AccountData.fromJSONMap);
    }

    static arrayToJSON(data: AccountData[]): string {
        return JSON.stringify(data);
    }
}

function PushAccountToData(account: AccountData, app: AppState): void {
    let newData = [...app.data];

    newData.push(account);

    app.setData(newData);
}

function AddAccountHandler(
    name: string,
    password: string,
    AppState: AppState
): void {
    let account = new AccountData(name, password, AppState.data.length);

    if (account.isEmpty()) {
        return;
    }

    console.log("Adding Account...");

    PushAccountToData(account, AppState);
}

function GetPhoneNumberFromData(data: AccountData[]): string {
    for (let i = 0; i < data.length; i++) {
        if (data[i].IsSpecial && data[i].Name == "Phone_Number") {
            return data[i].Password;
        }
    }

    return "";
}

function AddPhoneNumber(phoneNumber: string, AppState: AppState): void {
    if (GetPhoneNumberFromData(AppState.data) != "") {
        return;
    }

    let phoneNumberAccount = new AccountData(
        "Phone_Number",
        phoneNumber,
        AppState.data.length,
        true
    );

    PushAccountToData(phoneNumberAccount, AppState);
}

function RemovePhoneNumber(AppState: AppState): void {
    let isNotPhoneNumber = (account: AccountData) => {
        return !account.IsSpecial || account.Name != "Phone_Number";
    };

    let newData = AppState.data.filter(isNotPhoneNumber);

    AppState.setData(newData);
}

function SwapAccounts(
    index1: number,
    index2: number,
    AppState: AppState
): void {
    if (
        index1 < 0 ||
        index2 < 0 ||
        index1 >= AppState.data.length ||
        index2 >= AppState.data.length
    )
        return;

    let newData = [...AppState.data];

    let temp = newData[index1];
    newData[index1] = newData[index2];
    newData[index2] = temp;

    AppState.setData(newData);
}

export {
    AccountData,
    AddAccountHandler,
    GetPhoneNumberFromData,
    AddPhoneNumber,
    RemovePhoneNumber,
    SwapAccounts,
};
