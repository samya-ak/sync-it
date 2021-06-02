import { LiquidSwipe } from "./LiquidSwipe";
import Slide from "./Slide";
import { liquidSwiperData as data } from "../config";

const Test = () => {
  const components = [];
  const colors = ["#fff", "#fff", "#fff"];

  data.forEach((datum) => {
    components.push(<Slide data={datum} />);
  });
  return <LiquidSwipe components={components} colors={colors} />;
};

export default Test;
