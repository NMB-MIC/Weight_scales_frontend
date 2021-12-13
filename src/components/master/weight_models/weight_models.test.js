import React from "react";
import { shallow } from "enzyme";
import Weight_models from "./weight_models";

describe("Weight_models", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Weight_models />);
    expect(wrapper).toMatchSnapshot();
  });
});
