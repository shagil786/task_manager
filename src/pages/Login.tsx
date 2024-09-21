import React from "react";
import { useForm } from "react-hook-form";
import styles from "./index.module.css";
import { login } from "../utils/api";
import { setToken } from "../utils/auth-utils";
import { useNavigate } from "react-router-dom";
import { setUserDetailsInfo } from "../utils/userDetailsInfo";
import Toast from "../common/components/Toast/Toast";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await login({ email: data.email, password: data.password });
      const { token, user, presignedUrl, userId } = res;
      await setToken({ token, username: user });
      setUserDetailsInfo({
        token,
        email: user,
        presignedUrl,
        userId,
      });
      navigate("/app/dashboard");
      window.location.reload();
    } catch (err) {
      Toast("error", "Email or Password does not match", "3000", "top-right");
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className={loginForm}>
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

            <a href="/#/forgot-password">Forgot Password</a>
            <button type="submit" disabled={Object.keys(errors).length > 0}>
              Sign In
            </button>
          </form>

          <div className={borderLineStyle}>
            <hr /> or <hr />
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
