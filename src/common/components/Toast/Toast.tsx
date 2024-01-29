import React from "react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Toast.css";
import {
  faCheckCircle,
  faInfoCircle,
  faTimesCircle,
  faBan,
} from "@fortawesome/free-solid-svg-icons";

const Toast: any = (type: any, text: any, time: any, position: any) => {
  switch (type) {
    case "default":
    default:
      return basic(text, time, position);
    case "success":
      return success(text, time, position);
    case "error":
      return error(text, time, position);
    case "info":
      return info(text, time, position);
    case "warning":
      return warn(text, time, position);
  }
};
const toastWithIcon = (text: any, icon: any) => {
  return (
    <React.Fragment>
      <span className="px-2">
        <FontAwesomeIcon icon={icon} />
      </span>
      <span>{text}</span>
    </React.Fragment>
  );
};
const success = (text: any, time: any, position: any) => {
  toast.success(toastWithIcon(text, faCheckCircle), {
    position: position,
    transition: Slide,
    autoClose: time,
  });
};
const error = (text: any, time: any, position: any) => {
  toast.error(toastWithIcon(text, faTimesCircle), {
    position: position,
    transition: Slide,
    autoClose: time,
  });
};
const warn = (text: any, time: any, position: any) => {
  toast.warn(toastWithIcon(text, faBan), {
    position: position,
    transition: Slide,
    autoClose: time,
  });
};
const info = (text: any, time: any, position: any) => {
  toast.info(toastWithIcon(text, faInfoCircle), {
    position: position,
    transition: Slide,
    autoClose: time,
  });
};
const basic = (text: any, time: any, position: any) => {
  toast(text, {
    position: position,
    transition: Slide,
    autoClose: time,
  });
};
export default Toast;
