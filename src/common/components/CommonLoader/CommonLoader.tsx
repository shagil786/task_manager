import React from "react";
import styles from "./CommonLoader.module.css";

const CommonLoader = () => {
  const { spinnerStyle } = styles;
  return (
    <div className={spinnerStyle}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default CommonLoader;
