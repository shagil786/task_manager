import React, { useEffect, useRef } from "react";
import styles from "./Modal.module.css";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface ModalProps {
  children: any;
  isOpen: any;
  setIsOpen: any;
  width?: any;
  height?: any;
  customStyle?: any;
}

const Modal: React.FC<ModalProps> = (props) => {
  const { containerStyle, modalContent, modalWrapper, closeButton } = styles;
  const modalRef = useRef<any>(null);

  const handleOutsideClick = (event: any) => {
    if (modalRef.current && !modalRef.current.contains(event?.target))
      props?.setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [props?.isOpen]);

  if (!props?.isOpen) return null;
  return createPortal(
    <div className={containerStyle}>
      <div className={`${modalContent} ${props?.customStyle}`} ref={modalRef}>
        <div className={modalWrapper}>
          <button
            className={closeButton}
            onClick={() => props?.setIsOpen(false)}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
          {props?.children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
