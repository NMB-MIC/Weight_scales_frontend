import React from "react";
import { shallow } from "enzyme";
import WeightGauge from "./weightGauge";

describe("WeightGauge", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<WeightGauge />);
    expect(wrapper).toMatchSnapshot();
  });
});
