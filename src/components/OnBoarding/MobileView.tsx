import React, { useState } from "react";
import styles from "./OnBoarding.module.css";
import CircularStepper from "../../common/components/Stepper/CircularStepper";
import { faForward, faForwardStep } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Image1 from "../../images/image1.png";
import Image2 from "../../images/image2.png";
import Image3 from "../../images/image3.png";

interface MobileViewProps {}

const MobileView: React.FC<MobileViewProps> = () => {
  const {
    conatinerStyle,
    fontStyle,
    bottomContainer,
    screenStyle,
    centerStyle,
    backgroundStyle,
  } = styles;
  const [pageNo, setPageNo] = useState<number>(1);
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

  const navigate = useNavigate();

  return (
    <div className={conatinerStyle}>
      <div className={backgroundStyle}></div>
      <div className={screenStyle}>
        <img
          src={Image1}
          alt="onboaring image"
          style={{
            display: pageNo == 1 ? "" : "none",
          }}
        />
        <img
          src={Image2}
          alt="onboaring image"
          style={{
            display: pageNo == 2 ? "" : "none",
          }}
        />
        <img
          src={Image3}
          alt="onboaring image"
          style={{
            display: pageNo == 3 ? "" : "none",
          }}
        />
        <div className={centerStyle}>
          <h1>{steps[pageNo]?.title}</h1>
          <h3>{steps[pageNo]?.subtitle}</h3>
        </div>
      </div>
      <div className={bottomContainer}>
        <FontAwesomeIcon icon={faForward} onClick={() => navigate("/login")} />
        <CircularStepper
          steps={steps}
          activeStep={pageNo}
          icon={faForwardStep}
          fontStyle={fontStyle}
          handleClick={() =>
            pageNo == steps?.length
              ? navigate("/login")
              : setPageNo((prev) => prev + 1)
          }
        />
      </div>
    </div>
  );
};

export default MobileView;
