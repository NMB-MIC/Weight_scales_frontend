import React from "react";
import { shallow } from "enzyme";
import Weight_scales from "./weight_scales";

describe("Weight_scales", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Weight_scales />);
    expect(wrapper).toMatchSnapshot();
  });
});
