import React from "react";
import { Each } from "../../../utils/EachLoop";
import styles from "./GlobalFilter.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

interface GlobalFilterProps {
  selectedFilter: any;
  data: any;
  handleCLick: any;
}

const GlobalFilter: React.FC<GlobalFilterProps> = ({
  selectedFilter,
  data,
  handleCLick,
}) => {
  const { FilterStyle, selectedStyle } = styles;

  const render = (
    item: any,
    index: any,
    handleCLick: any,
    selectedFilter: any,
  ) => (
    <button
      className={`${FilterStyle} ${
        selectedFilter?.filter?.value === item?.value ? selectedStyle : ""
      }`}
      key={`${item?.value}_${index}`}
      onClick={() =>
        handleCLick({ filter: item, order: !selectedFilter?.order })
      }
    >
      {item?.name}
      {selectedFilter?.order != undefined &&
      selectedFilter?.filter?.value == item?.value ? (
        <FontAwesomeIcon
          icon={selectedFilter?.order ? faArrowUp : faArrowDown}
        />
      ) : null}
    </button>
  );
  return (
    <Each data={data} handleClick={handleCLick} selectedFolder={selectedFilter}>
      {render}
    </Each>
  );
};

export default GlobalFilter;
