import {
    AccountData,
    AddPhoneNumber,
    RemovePhoneNumber,
    SwapAccounts,
} from "../Services/AccountData";
import { AppState } from "../App";
import { useStatePair } from "../StatePair";
import { useEffect, useState } from "react";
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

describe("AddPhoneNumber", () => {
    it("should render phone number after add", () => {
        render(<AddPhoneNumberComponent baseData={[]} />);

        expect(
            screen.getByText("Phone_Number:+1234567890")
        ).toBeInTheDocument();
    });

    it("should not add multiple phone numbers", () => {
        render(
            <AddPhoneNumberComponent
                baseData={[
                    new AccountData("Phone_Number", "+1234567890", 0, true),
                ]}
            />
        );

        expect(screen.getByText("Length:1")).toBeInTheDocument();
    });
});

describe("RemovePhoneNumber", () => {
    it("should not remove non-special phone number account", () => {
        render(
            <RemovePhoneNumberComponent
                baseData={[new AccountData("Phone_Number", "+1234567890", 0)]}
            />
        );

        expect(screen.getByText("Length:1")).toBeInTheDocument();
    });

    it("should have length 0 after phone number is removed", () => {
        render(
            <RemovePhoneNumberComponent
                baseData={[
                    new AccountData("Phone_Number", "+1234567890", 0, true),
                ]}
            />
        );

        expect(screen.getByText("Length:0")).toBeInTheDocument();
    });
});

describe("SwapAccounts", () => {
    it("should swap accounts", () => {
        render(
            <SwapAccountsComponent
                index1={0}
                index2={1}
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
            />
        );

        expect(screen.getByText("Account[0]:Test2")).toBeInTheDocument();
        expect(screen.getByText("Account[1]:Test1")).toBeInTheDocument();
    });

    it("should not swap accounts if index1 is out of bounds", () => {
        render(
            <SwapAccountsComponent
                index1={2}
                index2={1}
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
            />
        );

        expect(screen.getByText("Account[0]:Test1")).toBeInTheDocument();
        expect(screen.getByText("Account[1]:Test2")).toBeInTheDocument();
    });

    it("should not swap accounts if index2 is out of bounds", () => {
        render(
            <SwapAccountsComponent
                index1={0}
                index2={2}
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
            />
        );

        expect(screen.getByText("Account[0]:Test1")).toBeInTheDocument();
        expect(screen.getByText("Account[1]:Test2")).toBeInTheDocument();
    });
});

const AddPhoneNumberComponent = (props: {
    baseData: AccountData[];
}): JSX.Element => {
    const [data, setData] = useState<AccountData[]>(props.baseData);

    const state: AppState = {
        error: useStatePair<string>(""),
        password: useStatePair<string>(""),
        tfaCode: useStatePair<string>(""),
        setData: setData,
        data: data,
        isLoading: useStatePair<boolean>(false),
        //tooltip: useStatePair<string>("")
    };

    useEffect(() => {
        AddPhoneNumber("+1234567890", state);
    }, []);

    return (
        <div>
            {data.map((account, index) => (
                <div key={index}>
                    {account.Name}:{account.Password}
                </div>
            ))}
            <div>Length:{data.length}</div>
        </div>
    );
};

const RemovePhoneNumberComponent = (props: {
    baseData: AccountData[];
}): JSX.Element => {
    const [data, setData] = useState<AccountData[]>(props.baseData);

    const state: AppState = {
        error: useStatePair<string>(""),
        password: useStatePair<string>(""),
        tfaCode: useStatePair<string>(""),
        setData: setData,
        data: data,
        isLoading: useStatePair<boolean>(false),
        //tooltip: useStatePair<string>("")
    };

    useEffect(() => {
        RemovePhoneNumber(state);
    }, []);

    return <div>Length:{data.length}</div>;
};

const SwapAccountsComponent = (props: {
    index1: number;
    index2: number;
    baseData: AccountData[];
}): JSX.Element => {
    const [data, setData] = useState<AccountData[]>(props.baseData);

    const state: AppState = {
        error: useStatePair<string>(""),
        password: useStatePair<string>(""),
        tfaCode: useStatePair<string>(""),
        setData: setData,
        data: data,
        isLoading: useStatePair<boolean>(false),
        //tooltip: useStatePair<string>("")
    };

    useEffect(() => {
        SwapAccounts(props.index1, props.index2, state);
    }, []);

    return (
        <div>
            {data.map((account, index) => (
                <div key={index}>
                    Account[{index}]:{account.Name}
                </div>
            ))}
        </div>
    );
};
