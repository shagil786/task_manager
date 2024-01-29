import React, { useEffect, useState } from "react";
import styles from "./OnBoarding.module.css";
import Image1 from "../../images/image1.png";
import Image2 from "../../images/image2.png";
import Image3 from "../../images/image3.png";
import { useNavigate } from "react-router-dom";

interface DesktopViewProps {}

const DesktopView: React.FC<DesktopViewProps> = () => {
  const {
    container1Style,
    leftStyle,
    rightStyle,
    slide,
    centerStyle,
    screenStyle,
    getStatrtedButton,
  } = styles;
  const [pageNo, setPageNo] = useState<number>(0);
  const steps = [
    {
      title: "Read",
      subtitle: "A lot of interesting books on your favorite topics!",
    },
    {
      title: "Explore",
      subtitle: "Big library of different articles and videos!",
    },
    {
      title: "Grow",
      subtitle: "Earn start and grow your own mosnter!",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPageNo((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [steps.length, pageNo]);

  const navigate = useNavigate();

  return (
    <div className={container1Style}>
      <div className={leftStyle}>
        <div className={screenStyle}>
          <img
            className={slide}
            src={Image1}
            style={{
              display: pageNo == 0 ? "" : "none",
            }}
          ></img>
          <img
            className={slide}
            src={Image2}
            style={{
              display: pageNo == 1 ? "" : "none",
            }}
          ></img>
          <img
            className={slide}
            src={Image3}
            style={{
              display: pageNo == 2 ? "" : "none",
            }}
          ></img>
          <div className={centerStyle}>
            <h1>{steps[pageNo]?.title}</h1>
            <h3>{steps[pageNo]?.subtitle}</h3>
          </div>
        </div>
      </div>
      <div className={rightStyle}>
        <button
          className={getStatrtedButton}
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default DesktopView;
