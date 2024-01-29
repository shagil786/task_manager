import React from "react";
import styles from "./CommonCard.module.css";

interface CommonCardProps {
  children: any;
  width?: any;
  height?: any;
  cardWrapper?: any;
}

const CommonCard: React.FC<CommonCardProps> = ({
  children,
  width,
  height,
  cardWrapper,
}) => {
  const { conatinerStyle } = styles;
  return (
    <div
      className={conatinerStyle}
      style={{
        width: width,
        height: height,
      }}
    >
      <div className={cardWrapper}>{children}</div>
    </div>
  );
};

export default CommonCard;
