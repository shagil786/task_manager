import React, { Suspense, useMemo, useState, useEffect } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import OnBoarding from "./pages/OnBoaring";
import Login from "./pages/Login";
import { DeveloperDataContext } from "./utils/appContext";
import CommonLoader from "./common/components/CommonLoader/CommonLoader";
import { isLoggedIn } from "./utils/cookies-utils";
import {
  WebSocketConnection,
  isAliveWebSocket,
} from "./common/webSocket/WebSocket";
import { socketData } from "./common/webSocket/SocketData";
import Signup from "./pages/Signup";
import SideBar from "./common/components/SideBar/SideBar";

const Home = React.lazy(() => import("./pages/Home"));

function App() {
  const [appData, setAppData] = useState<any>(null);
  const [globalLevelCall, setGlobalLevelCall] = useState<boolean>(false);
  const isAuth = isLoggedIn();

  // WebSocket connection side-effect
  useEffect(() => {
    if (isAuth && globalLevelCall && !isAliveWebSocket()) {
      setGlobalLevelCall(false);
      const socket = new WebSocketConnection();
      socket.connect(socketData({ socketInstance: socket }));
    }
  }, [isAuth, globalLevelCall]);

  const contextValue = useMemo(
    () => ({
      appData,
      setAppData,
    }),
    [appData, setAppData]
  );

  return (
    <DeveloperDataContext.Provider value={contextValue}>
      <Suspense fallback={<CommonLoader />}>
        <SideBar>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  !isLoggedIn() ? (
                    <OnBoarding />
                  ) : (
                    <Navigate
                      to="/app/dashboard"
                      replace={true}
                      state={{ reload: true }}
                    />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  !isLoggedIn() ? (
                    <Login />
                  ) : (
                    <Navigate
                      to="/app/dashboard"
                      replace={true}
                      state={{ reload: true }}
                    />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  !isLoggedIn() ? (
                    <Signup />
                  ) : (
                    <Navigate
                      to="/app/dashboard"
                      replace={true}
                      state={{ reload: true }}
                    />
                  )
                }
              />
              <Route
                path="/app/dashboard"
                element={
                  isLoggedIn() ? (
                    <Home />
                  ) : (
                    <Navigate
                      to="/login"
                      replace={true}
                      state={{ reload: true }}
                    />
                  )
                }
              />
            </Routes>
          </Router>
        </SideBar>
      </Suspense>
    </DeveloperDataContext.Provider>
  );
}

export default App;
