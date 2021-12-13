import React from "react";
import { shallow } from "enzyme";
import WeightDeviceDetail from "./weightDeviceDetail";

describe("WeightDeviceDetail", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<WeightDeviceDetail />);
    expect(wrapper).toMatchSnapshot();
  });
});
