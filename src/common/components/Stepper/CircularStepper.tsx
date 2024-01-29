import React from "react";
import "./style/style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CircularStepperProps {
  size?: any;
  strokeWidth?: any;
  activeStep?: any;
  steps?: any;
  icon?: any;
  fontStyle: any;
  handleClick: any;
}

const CircularStepper: React.FC<CircularStepperProps> = (props) => {
  const {
    size = 60,
    strokeWidth = 4,
    activeStep = 1,
    steps = [
      { title: "Title - 1", subtitle: "subtile - 1" },
      { title: "Title - 2", subtitle: "subtile - 2" },
      { title: "Title - 3", subtitle: "subtile - 3" },
    ],
    icon = "",
  } = props;
  const radius = (size - strokeWidth) / 2;
  const dashArray = radius * Math.PI * 2;
  const percentage = (activeStep / steps.length) * 100;
  const dashOffset = dashArray - (dashArray * percentage) / 100;
  return (
    <React.Fragment>
      <div className="circular-stepper-container">
        <div className="circular-stepper" onClick={props?.handleClick}>
          <svg width={size} height={size}>
            <circle
              className="circle-background"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
            />
            <circle
              className="circle-progress"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={`${strokeWidth}px`}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset,
              }}
            />
            <g transform={`translate(${size / 6}, ${size / 6}) scale(0.7)`}>
              <FontAwesomeIcon icon={icon} color="#6425FE" />
            </g>
          </svg>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CircularStepper;
