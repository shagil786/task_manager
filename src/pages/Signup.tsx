import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { signup } from "../utils/api";
import { setToken } from "../utils/auth-utils";
import { setUserDetailsInfo } from "../utils/userDetailsInfo";
import sampleImg from "../images/SideBar/60111.webp";
import Toast from "../common/components/Toast/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare } from "@fortawesome/free-solid-svg-icons";

interface SignupFormInputs {
  username: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
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
    editButton,
  } = styles;

  const navigate = useNavigate();
  const inputRef = useRef<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormInputs>({
    mode: "onChange", // Enables live validation as user types
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);

    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: SignupFormInputs) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const res = await signup(formData);
      const { token, user, presignedUrl, userId } = res;
      await setToken({ token, username: user });
      setUserDetailsInfo({ token, email: user, presignedUrl, userId });
      navigate("/app/dashboard");
      window.location.reload();
    } catch (err) {
      Toast("error", "Email or Password does not match", "3000", "top-right");
    }
  };

  return (
    <div className={conatiner1Style}>
      <div className={leftStyle}>
        <div className={leftConatinerStyle}>
          <div className={uploadImageStyle}>
            <img
              src={imageUrl ? imageUrl : sampleImg}
              alt="sampleImg"
              onClick={() => inputRef.current?.click()}
            />
            {imageUrl ? null : (
              <FontAwesomeIcon className={editButton} icon={faPenSquare} />
            )}
            <input
              type="file"
              accept="image/*"
              className={hiddenUpload}
              ref={inputRef}
              onChange={handleFileChange}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className={loginForm}>
            <div className={usernameStyle}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                placeholder="Example"
                {...register("username", {
                  required: "Name is required",
                })}
              />
              {errors.username && (
                <div className={errorStyle}>{errors.username.message}</div>
              )}
            </div>

            <div className={emailStyle}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Example@email.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <div className={errorStyle}>{errors.email.message}</div>
              )}
            </div>

            <div className={passwordStyle}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="at least 8 characters"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.password && (
                <div className={errorStyle}>{errors.password.message}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={
                Object.keys(errors).length > 0 ||
                !watch("username") ||
                !watch("email") ||
                !watch("password")
              }
            >
              Sign Up
            </button>
          </form>

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
