import React, { useState } from "react";
import styles from "./ListTasks.module.css";
import CommonCard from "../CommonCard/CommonCard";

const ListTasks: any = (item: any, index: any) => {
  const { containerStyle } = styles;
  return (
    <CommonCard
      key={`${item?.name}_${index}`}
      height="100px"
      cardWrapper={containerStyle}
    >
      {item?.name}: {item?.value}
    </CommonCard>
  );
};

export default ListTasks;
