import React from "react";
import MobileView from "../components/OnBoarding/MobileView";
import DesktopView from "../components/OnBoarding/DesktopView";
import useWindowResize from "../utils/useWindowResize";

interface OnBoaringProps {}

const OnBoaring: React.FC<OnBoaringProps> = () => {
  const [windowWidth, windowHeight]: any = useWindowResize();
  return <>{windowWidth < 676 ? <MobileView /> : <DesktopView />}</>;
};

export default OnBoaring;
