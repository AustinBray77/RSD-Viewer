import { AccountData, AccountIndexer } from "../Services/AccountData";

describe("GenerateSubStringMap", () => {
    it("should generate a map of substrings", () => {
        let map = AccountIndexer.GenerateSubStringMap("test");

        expect(map.get("t")).toBe(0);
        expect(map.get("te")).toBe(0);
        expect(map.get("st")).toBe(2);
        expect(map.get("est")).toBe(1);
        expect(map.get("s")).toBe(2);
        expect(map.get("test")).toBe(0);
        expect(map.get("b")).toBe(undefined);
        expect(map.get("tests")).toBe(undefined);
        expect(map.get("")).toBe(undefined);
    });

    it("should generate nothing from an empty string", () => {
        let map = AccountIndexer.GenerateSubStringMap("");

        expect(map.size).toBe(0);
    });

    /*test("the speed of the indexer with a long string", () => {
        let str = "a".repeat(100);

        AccountIndexer.GenerateSubStringMap(str);
    });*/
});

describe("IndexAccount", () => {
    it("should index an account", () => {
        let indexer = new AccountIndexer([]);
        let account = new AccountData("test", "test", 0);

        indexer.IndexAccount(account);

        let map = indexer.GetIndexedAccount(account);

        expect(map.size).toBe(9);
        expect(map?.get("t")).toBe(0);
        expect(map?.get("te")).toBe(0);
        expect(map?.get("st")).toBe(2);
        expect(map?.get("est")).toBe(1);
        expect(map?.get("s")).toBe(2);
        expect(map?.get("test")).toBe(0);
        expect(map?.get("b")).toBe(undefined);
        expect(map?.get("tests")).toBe(undefined);
        expect(map?.get("")).toBe(undefined);
    });
});

describe("UnIndexAccount", () => {
    it("should unindex an account", () => {
        let account = new AccountData("test", "test", 0);
        let indexer = new AccountIndexer([account]);

        indexer.UnIndexAccount(account);

        let map = indexer.GetIndexedAccount(account);

        expect(map.size).toBe(0);
    });
});
