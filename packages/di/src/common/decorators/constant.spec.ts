import {Store} from "@tsed/core";
import {INJECTABLE_PROP} from "../constants/constants.js";
import {Constant} from "./constant.js";

class Test {}

describe("@Constant()", () => {
  it("should store metadata", () => {
    // WHEN
    Constant("expression")(Test, "test");

    // THEN
    const store = Store.from(Test).get(INJECTABLE_PROP);

    expect(store).toEqual({
      test: {
        bindingType: "constant",
        propertyKey: "test",
        expression: "expression",
        defaultValue: undefined
      }
    });
  });
});
