import React, { useState } from "react";
import styles from "./TopBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import smapleImg from "../../../images/SideBar/60111.webp";
import { getUserDetailsInfo } from "../../../utils/userDetailsInfo";

interface TopBarProps {}

const TopBar: React.FC<TopBarProps> = (props) => {
  const {
    containerStyle,
    searchContainer,
    profileContainer,
    searchIconStyle,
    profilePicStyle,
  } = styles;
  const [searchInput, setSearchInput] = useState<any>("");
  const [userImage, setUserImage] = useState<any>(
    getUserDetailsInfo()?.presignedUrl,
  );
  const handleChange = (e: any) => {
    setSearchInput(e?.target?.value);
  };
  return (
    <div className={containerStyle}>
      <div className={searchContainer}>
        <FontAwesomeIcon icon={faSearch} className={searchIconStyle} />
        <input
          value={searchInput}
          onChange={handleChange}
          id="search"
          name="search"
          placeholder="Search"
        />
      </div>
      <div className={profileContainer}>
        <FontAwesomeIcon icon={faBell} />
        <div className={profilePicStyle}>
          <img src={userImage ? userImage : smapleImg} alt="profile" />
        </div>
      </div>
    </div>
  );
};
export default TopBar;
