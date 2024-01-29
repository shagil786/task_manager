import React, { useEffect, useState } from "react";
import styles from "./SideBar.module.css";
import DashboardIcon from "../../../images/SideBar/DashboardIcon.svg";
import DashboardIconActive from "../../../images/SideBar/DashboardIconActive.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import Logout from "../Logout/Logout";
import TopBar from "../TobBar/TopBar";

interface SideBarProps {
  children: any;
  title?: any;
}

interface pannelsProps {
  name: string;
  icon: any;
  iconActive: any;
  redirectUrl: string;
}

const SideBar: React.FC<SideBarProps> = (props) => {
  const {
    sidebar,
    companyTitleCss,
    sidebarContainer,
    userPannelCss,
    pannelContentCss,
    eachPannelCss,
    eachPannelCssActive,
    arrowContainer,
    sidebarFixedCss,
    logoutCss,
    sideBarWrapper,
    childContainer,
    childContent,
    childExpand,
  } = styles;
  const [sideBarFixed, setSideBarFixed] = useState<boolean>(true);
  const [selectedBar, setSelectedBar] = useState<string>("Dashboard");
  const [hover, setHover] = useState<boolean>();
  const [url, setUrl] = useState("");
  const pannels: Array<pannelsProps> = [
    {
      name: "Dashboard",
      icon: DashboardIcon,
      iconActive: DashboardIconActive,
      redirectUrl: "",
    },
  ];

  const handleLogout = () => {
    Logout({
      hardReload: true,
      routeTo: "/",
    });
  };

  const navigateTo = (each: pannelsProps) => {
    setSelectedBar(each?.name);
  };

  const mouseEvent = (e: any, icon: any, each: any) =>
    selectedBar != each?.name && (e.target.children.item(0).src = icon);

  const SideBarFixed = (
    <div className={`${sidebar} ${sideBarFixed ? "" : sidebarFixedCss}`}>
      <FontAwesomeIcon
        icon={sideBarFixed ? faChevronCircleLeft : faChevronCircleRight}
        className={arrowContainer}
        onClick={() => setSideBarFixed(!sideBarFixed)}
      />
      <div className={sidebarContainer}>
        <div className={companyTitleCss}>
          <p>{sideBarFixed ? "1% Club" : "1%"}</p>
        </div>
        <div className={userPannelCss}>
          <p>User Panel</p>
          <div className={pannelContentCss}>
            {pannels?.map((each: pannelsProps, index: number) => (
              <div
                className={`${eachPannelCss} ${
                  selectedBar == each?.name ? eachPannelCssActive : ""
                }`}
                key={`${each?.name}_${index}`}
                onClick={() => navigateTo(each)}
                onMouseEnter={(e: any) => mouseEvent(e, each?.iconActive, each)}
                onMouseLeave={(e: any) => mouseEvent(e, each?.icon, each)}
              >
                <img
                  src={
                    selectedBar == each?.name || hover
                      ? each?.iconActive
                      : each?.icon
                  }
                />
                <p>{sideBarFixed ? each?.name : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={logoutCss} onClick={() => handleLogout()}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        <p>{sideBarFixed ? "Logout" : ""}</p>
      </div>
    </div>
  );

  useEffect(() => {
    setUrl(window != undefined ? window.location.href : "");
  }, [window.location.href as any, url]);

  if (url.includes("/app"))
    return (
      <div className={sideBarWrapper}>
        {SideBarFixed}
        <div className={`${childContainer} ${sideBarFixed ? "" : childExpand}`}>
          <TopBar />
          <div className={childContent}>{props?.children}</div>
        </div>
      </div>
    );
  else return props?.children;
};

export default SideBar;
