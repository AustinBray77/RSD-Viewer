import {
    CollapsableRandomArray,
    ArrayRange,
    AddRangeToSet,
} from "../Services/Math";

describe("CollapsableRandomArray", () => {
    it("should return an array of random numbers within the specified range", () => {
        const result = CollapsableRandomArray(1, 10, new Set(), 5);
        expect(result).toHaveLength(5);
        result.forEach((num) => {
            expect(num).toBeGreaterThanOrEqual(1);
            expect(num).toBeLessThanOrEqual(10);
        });
    });

    it("should exclude numbers specified in the exclude set", () => {
        const excludeSet = new Set([2, 4, 6]);
        const result = CollapsableRandomArray(1, 10, excludeSet, 5);
        result.forEach((num) => {
            expect(excludeSet.has(num)).toBe(false);
        });
    });

    it("should return an empty array if numberOfResults is 0", () => {
        const result = CollapsableRandomArray(1, 10, new Set(), 0);
        expect(result).toHaveLength(0);
    });
});

describe("ArrayRange", () => {
    it("should return an array of numbers within the specified range", () => {
        const result = ArrayRange(1, 5);
        expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should return an empty array if min is greater than max", () => {
        const result = ArrayRange(5, 1);
        expect(result).toHaveLength(0);
    });
});

describe("AddRangeToSet", () => {
    it("should add numbers within the specified range to the set", () => {
        const set = new Set([1, 2, 3]);
        const result = AddRangeToSet(4, 6, set);
        expect(result).toEqual(new Set([1, 2, 3, 4, 5, 6]));
    });

    it("should return the same set if min is greater than max", () => {
        const set = new Set([1, 2, 3]);
        const result = AddRangeToSet(6, 4, set);
        expect(result).toEqual(set);
    });
});
