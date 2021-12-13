import React from "react";
import { shallow } from "enzyme";
import VerifyFunction from "./verifyFunction";

describe("VerifyFunction", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<VerifyFunction />);
    expect(wrapper).toMatchSnapshot();
  });
});
