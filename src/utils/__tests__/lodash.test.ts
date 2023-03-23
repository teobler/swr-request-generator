import { get, has, pick, pickBy, sortBy, trimEnd } from "../lodash.js";

describe("lodash", () => {
  describe("# get", () => {
    it("should get value from object", () => {
      const obj = {
        a: {
          b: {
            c: "c",
          },
        },
      };

      expect(get(obj, "a.b.c")).toBe("c");
      expect(get(obj, "a.b.c.d")).toBeUndefined();
    });
  });

  describe("# has", () => {
    it("should check if object has property", () => {
      const obj = {
        a: {
          b: {
            c: "c",
          },
        },
      };

      expect(has(obj, "a.b.c")).toBeTruthy();
      expect(has(obj, "a.b.c.d")).toBeFalsy();
    });
  });

  describe("# sortBy", () => {
    it("should sort array of objects by key", () => {
      const arr = [{ a: 1 }, { a: 3 }, { a: 2 }];
      expect(arr.sort(sortBy("a"))).toEqual([{ a: 1 }, { a: 2 }, { a: 3 }]);
    });
  });

  describe("# pick", () => {
    it("should pick keys from object", () => {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });
  });

  describe("# pickBy", () => {
    it("should pick keys from object", () => {
      const obj = {
        a: 1,
        b: 2,
        c: 3,
      };
      expect(pickBy(obj, (value) => value === 2)).toEqual(2);
    });
  });

  describe("# trimEnd", () => {
    it("should trim end of string", () => {
      expect(trimEnd("abc  ")).toBe("abc");
    });
  });
});
