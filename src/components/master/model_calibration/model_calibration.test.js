import React from "react";
import { shallow } from "enzyme";
import Model_calibration from "./model_calibration";

describe("Model_calibration", () => {
  test("matches snapshot", () => {
    const wrapper = shallow(<Model_calibration />);
    expect(wrapper).toMatchSnapshot();
  });
});
