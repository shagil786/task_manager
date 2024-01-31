import React, { Suspense, useRef, useState } from "react";
import "./App.css";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import OnBoaring from "./pages/OnBoaring";
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
  const [appData, setAppData] = useState<any>();
  const [isAuth, setIsAuth] = useState(isLoggedIn());
  const [globalLevelCall, setGlobalCall] = useState<boolean>();

  if (isAuth && globalLevelCall && !isAliveWebSocket()) {
    setGlobalCall(false);
    let socket = new WebSocketConnection();
    socket.connect(socketData({ socketInstance: socket }));
  }
  return (
    <DeveloperDataContext.Provider
      value={{
        appData,
        setAppData,
      }}
    >
      <Suspense fallback={<CommonLoader />}>
        <SideBar>
          <Router>
            <Routes>
              <Route
                path="/"
                Component={(props: any) => {
                  return !isLoggedIn() ? (
                    <OnBoaring />
                  ) : (
                    <Navigate
                      to="/app/dashboard"
                      replace={true}
                      state={{
                        roload: true,
                      }}
                    />
                  );
                }}
              />
              <Route
                path="/login"
                Component={(props: any) => {
                  return !isLoggedIn() ? (
                    <Login />
                  ) : (
                    <Navigate
                      to="/app/dashboard"
                      replace={true}
                      state={{
                        roload: true,
                      }}
                    />
                  );
                }}
              />
              <Route
                path="/signup"
                Component={(props: any) => {
                  return !isLoggedIn() ? (
                    <Signup />
                  ) : (
                    <Navigate
                      to="/app/dashboard"
                      replace={true}
                      state={{
                        roload: true,
                      }}
                    />
                  );
                }}
              />
              <Route
                path="/app/dashboard"
                Component={(props: any) => {
                  return isLoggedIn() ? (
                    <Home />
                  ) : (
                    <Navigate
                      to="/login"
                      replace={true}
                      state={{
                        roload: true,
                      }}
                    />
                  );
                }}
              />
            </Routes>
          </Router>
        </SideBar>
      </Suspense>
    </DeveloperDataContext.Provider>
  );
}

export default App;
