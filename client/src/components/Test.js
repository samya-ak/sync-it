import { LiquidSwipe } from "./LiquidSwipe";
import TestComp from "./TestComp";
const Test = () => {
  const components = [
    <TestComp heading={"Some heading"} color={"#ddaaff"} />,
    <TestComp heading={"Some heading2"} color={"#ddbbff"} />,
    <TestComp heading={"Some heading3"} color={"#ddccff"} />,
  ];
  const colors = ["#fff", "#fff", "#fff"];
  return <LiquidSwipe components={components} colors={colors} />;
};

export default Test;
