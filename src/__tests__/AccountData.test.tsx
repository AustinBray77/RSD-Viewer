import {
    AccountData,
    AccountIndexer,
    AddPhoneNumber,
    RemoveAccount,
    RemovePhoneNumber,
    SwapAccounts,
    UpdatePassword,
} from "../Services/AccountData";
import { AppState } from "../App";
import { useStatePair } from "../StatePair";
import { useEffect, useState } from "react";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SortOrder } from "../Services/Sorting";

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
            new AccountData("Test", "Test", 0, true),
            new AccountData("Another Test Wow", "Herey", 1),
            new AccountData("Yes its real", "big boi", 2, false),
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

    it("should load out of order data into order", () => {
        let accounts = [
            new AccountData("Test", "Test", 3),
            new AccountData("Another Test Wow", "Herey", 1),
            new AccountData("Yes its real", "big boi", 0),
            new AccountData("", "", 2),
        ];

        let reloadedAccounts = AccountData.arrayFromJSON(
            AccountData.arrayToJSON(accounts)
        );

        for (let i: number = 0; i < reloadedAccounts.length; i++) {
            if (reloadedAccounts[i].Position != i) {
                console.log(accounts[i]);
                throw (
                    "Account " +
                    i.toString() +
                    " was not in the correct position"
                );
            }
        }
    });
});

describe("AddPhoneNumber", () => {
    it("should render phone number after add", () => {
        render(
            <TestComponent
                baseData={[]}
                startFunction={(state) => {
                    AddPhoneNumber("+1234567890", state);
                }}
            />
        );

        expect(
            screen.getByText("Phone_Number:+1234567890:0")
        ).toBeInTheDocument();
    });

    it("should not add multiple phone numbers", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Phone_Number", "+1234567890", 0, true),
                ]}
                startFunction={(state) => {
                    AddPhoneNumber("+1234567890", state);
                }}
            />
        );

        expect(screen.getByText("Length:1")).toBeInTheDocument();
    });
});

describe("RemovePhoneNumber", () => {
    it("should not remove non-special phone number account", () => {
        render(
            <TestComponent
                baseData={[new AccountData("Phone_Number", "+1234567890", 0)]}
                startFunction={(state) => {
                    RemovePhoneNumber(state);
                }}
            />
        );

        expect(screen.getByText("Length:1")).toBeInTheDocument();
    });

    it("should have length 0 after phone number is removed", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Phone_Number", "+1234567890", 0, true),
                ]}
                startFunction={(state) => {
                    RemovePhoneNumber(state);
                }}
            />
        );

        expect(screen.getByText("Length:0")).toBeInTheDocument();
    });
});

describe("SwapAccounts", () => {
    it("should swap accounts", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
                startFunction={(state) => {
                    SwapAccounts(0, 1, state);
                }}
            />
        );

        expect(screen.getByText("Test2:Test2:0")).toBeInTheDocument();
        expect(screen.getByText("Test1:Test1:1")).toBeInTheDocument();
    });

    it("should not swap accounts if index1 is out of bounds", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
                startFunction={(state) => {
                    SwapAccounts(-1, 1, state);
                }}
            />
        );

        expect(screen.getByText("Test1:Test1:0")).toBeInTheDocument();
        expect(screen.getByText("Test2:Test2:1")).toBeInTheDocument();
    });

    it("should not swap accounts if index2 is out of bounds", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
                startFunction={(state) => {
                    SwapAccounts(1, 4, state);
                }}
            />
        );

        expect(screen.getByText("Test1:Test1:0")).toBeInTheDocument();
        expect(screen.getByText("Test2:Test2:1")).toBeInTheDocument();
    });
});

describe("RemoveAccount", () => {
    it("should remove account at the given index", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
                startFunction={(state) => {
                    RemoveAccount(0, state);
                }}
            />
        );

        expect(screen.getByText("Test2:Test2:0")).toBeInTheDocument();
    });

    it("should not remove account if index is out of bounds", () => {
        render(
            <TestComponent
                baseData={[new AccountData("Test1", "Test1", 0)]}
                startFunction={(state) => {
                    RemoveAccount(1, state);
                }}
            />
        );

        expect(screen.getByText("Test1:Test1:0")).toBeInTheDocument();
    });

    it("should not remove account if index is negative", () => {
        render(
            <TestComponent
                baseData={[new AccountData("Test1", "Test1", 0)]}
                startFunction={(state) => {
                    RemoveAccount(-1, state);
                }}
            />
        );

        expect(screen.getByText("Test1:Test1:0")).toBeInTheDocument();
    });
});

describe("UpdatePassword", () => {
    it("should update password at the given index", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                    new AccountData("Test3", "Test3", 2),
                ]}
                startFunction={(state) => {
                    UpdatePassword(0, "Updated", state);
                    UpdatePassword(1, "AlsoUpdated", state);
                }}
            />
        );

        expect(screen.getByText("Test1:Updated:0")).toBeInTheDocument();
        expect(screen.getByText("Test2:AlsoUpdated:1")).toBeInTheDocument();
        expect(screen.getByText("Test3:Test3:2")).toBeInTheDocument();
    });

    it("should not update if index is out of bounds", () => {
        render(
            <TestComponent
                baseData={[
                    new AccountData("Test1", "Test1", 0),
                    new AccountData("Test2", "Test2", 1),
                ]}
                startFunction={(state) => {
                    UpdatePassword(-1, "Updated", state);
                    UpdatePassword(2, "AlsoUpdated", state);
                }}
            />
        );

        expect(screen.getByText("Test1:Test1:0")).toBeInTheDocument();
        expect(screen.getByText("Test2:Test2:1")).toBeInTheDocument();
    });
});

describe("SortByPosition", () => {
    it("should order by ascending when ascending is passed in", () => {
        let accounts = [
            new AccountData("Test1", "Test1", 2),
            new AccountData("Test2", "Test2", 0),
            new AccountData("Test3", "Test3", 1),
        ];

        let sortedAccounts = AccountData.sortByPosition(
            accounts,
            SortOrder.Ascending
        );

        for (let i = 0; i < sortedAccounts.length; i++) {
            expect(sortedAccounts[i].Position).toBe(i);
        }
    });

    it("should order by descending when descending is passed in", () => {
        let accounts = [
            new AccountData("Test1", "Test1", 0),
            new AccountData("Test2", "Test2", 2),
            new AccountData("Test3", "Test3", 1),
        ];

        let sortedAccounts = AccountData.sortByPosition(
            accounts,
            SortOrder.Descending
        );

        for (let i = 0; i < sortedAccounts.length; i++) {
            expect(sortedAccounts[i].Position).toBe(2 - i);
        }
    });
});

describe("SortByName", () => {
    it("should order by ascending when ascending is passed in", () => {
        let accounts = [
            new AccountData("13141est1", "Test1", 0),
            new AccountData("AsafeawfTest", "Test3", 1),
            new AccountData("abtfasffeade", "Test2", 2),
        ];

        let expectedResult = [
            new AccountData("13141est1", "Test1", 0),
            new AccountData("abtfasffeade", "Test2", 2),
            new AccountData("AsafeawfTest", "Test3", 1),
        ];

        let sortedAccounts = AccountData.sortByName(
            accounts,
            SortOrder.Ascending
        );

        for (let i = 0; i < sortedAccounts.length; i++) {
            expect(sortedAccounts[i].equals(expectedResult[i])).toBe(true);
        }
    });

    it("should order by descending when descending is passed in", () => {
        let accounts = [
            new AccountData("13141est1", "Test1", 0),
            new AccountData("AsafeawfTest", "Test3", 1),
            new AccountData("abtfasffeade", "Test2", 2),
        ];

        let expectedResult = [
            new AccountData("AsafeawfTest", "Test3", 1),
            new AccountData("abtfasffeade", "Test2", 2),
            new AccountData("13141est1", "Test1", 0),
        ];

        let sortedAccounts = AccountData.sortByName(
            accounts,
            SortOrder.Descending
        );

        for (let i = 0; i < sortedAccounts.length; i++) {
            expect(sortedAccounts[i].equals(expectedResult[i])).toBe(true);
        }
    });
});

const TestComponent = (props: {
    baseData: AccountData[];
    startFunction: (state: AppState) => void;
}): JSX.Element => {
    const [data, setData] = useState<AccountData[]>(props.baseData);

    const state: AppState = {
        error: useStatePair<string>(""),
        password: useStatePair<string>(""),
        tfaCode: useStatePair<string>(""),
        setData: setData,
        data: data,
        isLoading: useStatePair<boolean>(false),
        indexedData: useStatePair<AccountIndexer>(new AccountIndexer([]))
        //tooltip: useStatePair<string>("")
    };

    useEffect(() => {
        props.startFunction(state);
    }, []);

    return (
        <div>
            {data.map((account, index) => (
                <div key={index}>
                    {account.Name}:{account.Password}:{account.Position}
                </div>
            ))}
            <div>Length:{data.length}</div>
        </div>
    );
};
