import { AppState } from "../App";
import { SortOrder } from "./Sorting";

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

    static sortByPosition(
        accounts: AccountData[],
        sortOrder: SortOrder
    ): AccountData[] {
        return accounts.sort((a, b) => (a.Position - b.Position) * sortOrder);
    }

    static sortByName(
        accounts: AccountData[],
        sortOrder: SortOrder
    ): AccountData[] {
        return accounts.sort((a, b) => {
            let aLowerName = a.Name.toLowerCase();
            let bLowerName = b.Name.toLowerCase();

            if (aLowerName < bLowerName) {
                return -1 * sortOrder;
            } else if (aLowerName > bLowerName) {
                return 1 * sortOrder;
            } else {
                return 0;
            }
        });
    }

    static arrayFromJSON(jsonString: string): AccountData[] {
        let accountMaps: Map<String, String>[] = (
            JSON.parse(jsonString) as Object[]
        ).map((obj: Object) => {
            return new Map(Object.entries(obj));
        });

        let unsortedAccounts = accountMaps.map(AccountData.fromJSONMap);

        return AccountData.sortByPosition(
            unsortedAccounts,
            SortOrder.Ascending
        );
    }

    static arrayToJSON(data: AccountData[]): string {
        let numberOfSwaps = Math.random() * (data.length - 1);
        let randomizedData = [...data];

        for (let i = 0; i < numberOfSwaps; i++) {
            let index1 = Math.floor(Math.random() * (data.length - 1));
            let index2 = Math.floor(Math.random() * (data.length - 1));

            let temp = randomizedData[index1];
            randomizedData[index1] = randomizedData[index2];
            randomizedData[index2] = temp;
        }

        return JSON.stringify(randomizedData);
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

function RemoveAccount(index: number, AppState: AppState): void {
    let newData = [...AppState.data];

    if (index >= newData.length || index < 0) {
        return;
    }

    newData.splice(index, 1);

    newData = newData.map((account, index) => {
        if (account.Position > index) {
            account.Position -= 1;
        }

        return account;
    });

    AppState.setData(newData);
}

function UpdatePassword(index: number, password: string, AppState: AppState) {
    let newData = [...AppState.data];

    if (index >= newData.length || index < 0) {
        return;
    }

    newData[index].Password = password;

    AppState.setData(newData);
}

function RemovePhoneNumber(AppState: AppState): void {
    let phoneNumberIndex = AppState.data.reduce((prev, curr) => {
        if (prev != -1) {
            return prev;
        }

        if (curr.IsSpecial && curr.Name == "Phone_Number") {
            return curr.Position;
        }

        return -1;
    }, -1);

    RemoveAccount(phoneNumberIndex, AppState);
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

    newData[index1].Position = index1;
    newData[index2].Position = index2;

    AppState.setData(newData);
}

export {
    AccountData,
    AddAccountHandler,
    RemoveAccount,
    UpdatePassword,
    GetPhoneNumberFromData,
    AddPhoneNumber,
    RemovePhoneNumber,
    SwapAccounts,
};
