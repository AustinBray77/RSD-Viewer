import {
    AccountData,
    AddPhoneNumber,
    RemovePhoneNumber,
} from "../Services/AccountData";
import { AppState } from "../App";
import { useStatePair } from "../StatePair";
import { useState } from "react";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";

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
    test("if stringify and destringy are inverse functions", () => {
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

    test("if Old Accounts transfer to New Accounts", () => {
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

describe("Phone Number Tests", () => {
    it("should render phone number after add", () => {
        render(<AddPhoneNumberComponent />);

        expect(
            screen.getByText("Phone_Number:+1234567890")
        ).toBeInTheDocument();
    });

    it("should have length 0 after phone number is removed", () => {
        render(<RemovePHoneNumberComponent />);

        expect(screen.getByText("Length:0")).toBeInTheDocument();
    });
});

const AddPhoneNumberComponent = (): JSX.Element => {
    const [data, setData] = useState<AccountData[]>([]);

    const state: AppState = {
        error: useStatePair<string>(""),
        password: useStatePair<string>(""),
        tfaCode: useStatePair<string>(""),
        setData: setData,
        data: data,
        isLoading: useStatePair<boolean>(false),
        //tooltip: useStatePair<string>("")
    };

    if (data.length == 0) {
        AddPhoneNumber("+1234567890", state);
    }

    return (
        <div>
            {data.map((account, index) => (
                <div key={index}>
                    {account.Name}:{account.Password}
                </div>
            ))}
        </div>
    );
};

const RemovePHoneNumberComponent = (): JSX.Element => {
    let phnAccount = new AccountData("Phone_Number", "+1234567890", 0);

    phnAccount.IsSpecial = true;

    const [data, setData] = useState<AccountData[]>([phnAccount]);

    const state: AppState = {
        error: useStatePair<string>(""),
        password: useStatePair<string>(""),
        tfaCode: useStatePair<string>(""),
        setData: setData,
        data: data,
        isLoading: useStatePair<boolean>(false),
        //tooltip: useStatePair<string>("")
    };

    if (data.length != 0) {
        RemovePhoneNumber(state);
    }

    return <div>Length:{data.length}</div>;
};
