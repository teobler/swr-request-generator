import { expect } from "vitest";
import { isValidVariableName } from "../specifications.js";

describe("# specifications", () => {
  it.each`
    variable     | result
    ${"test"}    | ${true}
    ${"IdTest"}  | ${true}
    ${"IDTest"}  | ${true}
    ${"ID-Test"} | ${false}
  `("## isValidVariableName", ({ variable, result }) => {
    expect(isValidVariableName(variable)).toBe(result);
  });
});
