import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.css";
import { signup } from "../utils/api";
import { setToken } from "../utils/auth-utils";
import { useNavigate } from "react-router-dom";
import { setUserDetailsInfo } from "../utils/userDetailsInfo";
import sampleImg from "../images/SideBar/60111.webp";
import Toast from "../common/components/Toast/Toast";

interface SignupProps {}

const Signup: React.FC<SignupProps> = () => {
  const {
    conatiner1Style,
    leftStyle,
    rightStyle,
    leftConatinerStyle,
    loginForm,
    emailStyle,
    passwordStyle,
    borderLineStyle,
    signUpLinkStyle,
    uploadImageStyle,
    usernameStyle,
    errorStyle,
    hiddenUpload,
  } = styles;

  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const inputRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>();
  const [imageUrl, setImageUrl] = useState<any>(null);

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

  const handleName = (e: any) => {
    setUsername(e?.target?.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);

    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file!);
  };

  const handleSubmit = () => {
    const formData = new FormData();

    if (selectedFile) {
      formData?.append("profileImage", selectedFile);
    }

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);

    signup(formData)
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
          userId,
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
    <div className={conatiner1Style}>
      <div className={leftStyle}>
        <div className={leftConatinerStyle}>
          <div className={uploadImageStyle}>
            <img
              src={imageUrl ? imageUrl : sampleImg}
              alt="sampleImg"
              onClick={() => {
                inputRef?.current?.click();
                setSelectedFile(null);
              }}
            />
            <input
              type="file"
              accept="image/*"
              className={hiddenUpload}
              ref={inputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className={loginForm}>
            <div className={usernameStyle}>
              <label htmlFor="email">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Example"
                onChange={handleName}
                value={username}
              />
            </div>
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
            <a></a>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={
                emailError ||
                passwordError ||
                email?.length == 0 ||
                password?.length == 0 ||
                username?.length == 0
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </div>
          <div className={borderLineStyle}>
            <hr />
            or
            <hr />
          </div>
          <p className={signUpLinkStyle}>
            Already Registered? <a href="#/login">Sign In</a>
          </p>
        </div>
      </div>
      <div className={rightStyle}></div>
    </div>
  );
};

export default Signup;
