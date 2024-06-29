import assert from "assert";
import { AccountData } from "../Services/AccountData";

/* Depreicated code */
class DepAccountData {
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

    static arrayFromJSON(jsonString: string): DepAccountData[] {
        return JSON.parse(jsonString);
    }

    static arrayToJSON(data: DepAccountData[]): string {
        return JSON.stringify(data);
    }
}

describe("Account Stringify Tests", () => {
    test("Stringify and Back", () => {
        let newAccounts: AccountData[] = [
            new AccountData("Test", "Test", 0),
            new AccountData("Another Test Wow", "Herey", 1),
            new AccountData("Yes its real", "big boi", 2),
            new AccountData("", "", 3),
        ];

        let stringified = AccountData.arrayToJSON(newAccounts);

        let unstringified = AccountData.arrayFromJSON(stringified);

        for (let i: number = 0; i < newAccounts.length; i++) {
            if (!newAccounts[i].equals(unstringified[i])) {
                throw "Accounts " + i.toString() + " were not equal";
            }
        }
    });

    test("Old Accounts to New Accounts", () => {
        let oldAccounts: DepAccountData[] = [
            new DepAccountData("Test", "Test"),
            new DepAccountData("Another Test Wow", "Herey"),
            new DepAccountData("Yes its real", "big boi"),
            new DepAccountData("", ""),
        ];

        let newAccounts: AccountData[] = [
            new AccountData("Test", "Test", 0),
            new AccountData("Another Test Wow", "Herey", 1),
            new AccountData("Yes its real", "big boi", 2),
            new AccountData("", "", 3),
        ];

        let reformattedOldAccounts: AccountData[] = AccountData.arrayFromJSON(
            DepAccountData.arrayToJSON(oldAccounts)
        );

        for (let i: number = 0; i < newAccounts.length; i++) {
            if (!newAccounts[i].equals(reformattedOldAccounts[i])) {
                console.log(newAccounts[i]);
                console.log(reformattedOldAccounts[i]);
                throw "Accounts " + i.toString() + " were not equal";
            }
        }
    });
});
