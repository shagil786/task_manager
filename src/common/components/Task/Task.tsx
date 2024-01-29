import React from "react";
import styles from "./Task.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Task: any = (
  item: any,
  index: number,
  handleClick: any,
  selectedTask: any,
  icomMap?: any,
) => {
  const { containerStyle, leftStyle, rightStyle, selectedStyle } = styles;
  return (
    <div
      className={`${containerStyle} ${
        selectedTask?._id === item?._id ? selectedStyle : ""
      }`}
      key={`${index}_${item?.name}`}
      onClick={() => handleClick(item, index)}
    >
      <div className={leftStyle}>
        <p>{index + 1}</p>
        <p>{item?.name}</p>
      </div>
      <FontAwesomeIcon
        className={rightStyle}
        data-type={item?.status}
        icon={icomMap[item?.status]}
      />
    </div>
  );
};

export default Task;
