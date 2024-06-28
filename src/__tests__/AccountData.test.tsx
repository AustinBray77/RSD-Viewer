import assert from "assert";
import { AccountData, NewAccountData } from "../Services/AccountData";

describe("Account Stringify Tests", () => {
    test("Stringify and Back", () => {
        let newAccounts: NewAccountData[] = [
            new NewAccountData("Test", "Test", 0),
            new NewAccountData("Another Test Wow", "Herey", 1),
            new NewAccountData("Yes its real", "big boi", 2),
            new NewAccountData("", "", 3),
        ];

        let stringified = NewAccountData.arrayToJSON(newAccounts);

        let unstringified = NewAccountData.arrayFromJSON(stringified);

        for (let i: number = 0; i < newAccounts.length; i++) {
            if (!newAccounts[i].equals(unstringified[i])) {
                throw "Accounts " + i.toString() + " were not equal";
            }
        }
    });

    test("Old Accounts to New Accounts", () => {
        let oldAccounts: AccountData[] = [
            new AccountData("Test", "Test"),
            new AccountData("Another Test Wow", "Herey"),
            new AccountData("Yes its real", "big boi"),
            new AccountData("", ""),
        ];

        let newAccounts: NewAccountData[] = [
            new NewAccountData("Test", "Test", 0),
            new NewAccountData("Another Test Wow", "Herey", 1),
            new NewAccountData("Yes its real", "big boi", 2),
            new NewAccountData("", "", 3),
        ];

        let reformattedOldAccounts: NewAccountData[] =
            NewAccountData.arrayFromJSON(AccountData.arrayToJSON(oldAccounts));

        for (let i: number = 0; i < newAccounts.length; i++) {
            if (!newAccounts[i].equals(reformattedOldAccounts[i])) {
                console.log(newAccounts[i]);
                console.log(reformattedOldAccounts[i]);
                throw "Accounts " + i.toString() + " were not equal";
            }
        }
    });
});
