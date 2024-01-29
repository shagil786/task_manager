import React, { useEffect } from "react";
import { logout as LogOutComp } from "../../../utils/auth-utils";
import CircularLoader from "../CommonLoader/CommonLoader";
import Toast from "../../../common/components/Toast/Toast";
import { isLoggedIn } from "../../../utils/cookies-utils";
import { closeAllSockets } from "../../../common/webSocket/WebSocket";
const Logout = ({ hardReload = false, routeTo }: any) => {
  let loggedOut: any = false;
  let redirectTo = routeTo;
  {
    routeTo != null ? (redirectTo = routeTo) : (redirectTo = "/");
  }
  if (isLoggedIn()) {
    {
      redirectTo = "/";
    }
    loggedOut = LogOutComp({ hardReload: hardReload, routeTo: redirectTo });
  }
  if (!loggedOut) return <CircularLoader />;
  else {
    Toast("info", "You have been logged out!", 3000, "top-right");
    closeAllSockets();
    return true;
  }
};
export default Logout;
