import React, { useState } from "react";
import styles from "./index.module.css";
import { login } from "../utils/api";
import { setToken } from "../utils/auth-utils";
import { useNavigate } from "react-router-dom";
import { setUserDetailsInfo } from "../utils/userDetailsInfo";
import Toast from "../common/components/Toast/Toast";
import { ToastContainer } from "react-toastify";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const {
    conatinerStyle,
    leftStyle,
    rightStyle,
    leftConatinerStyle,
    loginForm,
    emailStyle,
    passwordStyle,
    borderLineStyle,
    signUpLinkStyle,
    subHeader,
    errorStyle,
  } = styles;

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const handleEmail = (e: any) => {
    setEmailError(
      !e?.target?.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e?.target?.value)
        ? "Invalid email"
        : "",
    );
    setEmail(e?.target?.value);
  };

  const handlePassword = (e: any) => {
    setPasswordError(
      !e?.target?.value || e?.target?.value.length < 8
        ? "Password must be at least 8 characters"
        : "",
    );
    setPassword(e?.target?.value);
  };

  const handleSubmit = () => {
    login({ email: email, password: password })
      .then(async (res) => {
        let [token, username, presignedUrl, userId] = [
          res?.token,
          res?.user,
          res?.presignedUrl,
          res?.userId,
        ];
        await setToken({ token, username });
        let obj = {
          token: token,
          email: username,
          presignedUrl: presignedUrl,
          userId: userId,
        };
        setUserDetailsInfo(obj);
        navigate("/app/dashboard");
        window.location.reload();
      })
      .catch((err) => {
        Toast("error", "Email or Password does not match", "3000", "top-right");
      });
  };
  return (
    <div className={conatinerStyle}>
      <div className={leftStyle}>
        <div className={leftConatinerStyle}>
          <h2>Welcome Back 👋</h2>
          <p className={subHeader}>
            Today is a new day. It's your day. You shape it. Sign in to start
            managing your projects.
          </p>
          <div className={loginForm}>
            <div className={emailStyle}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Example@email.com"
                onChange={handleEmail}
                value={email}
              />
              {emailError && <div className={errorStyle}>{emailError}</div>}
            </div>
            <div className={passwordStyle}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="at least 8 characters"
                onChange={handlePassword}
                value={password}
              />
              {passwordError && (
                <div className={errorStyle}>{passwordError}</div>
              )}
            </div>
            <a href="">Forgot Password</a>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                emailError ||
                passwordError ||
                email?.length == 0 ||
                password?.length == 0
                  ? true
                  : false
              }
            >
              Sign In
            </button>
          </div>
          <div className={borderLineStyle}>
            <hr />
            or
            <hr />
          </div>
          <p className={signUpLinkStyle}>
            Don't you have an account? <a href="#/signup">Sign up</a>
          </p>
        </div>
      </div>
      <div className={rightStyle}></div>
    </div>
  );
};

export default Login;
