import React from "react";
import "../../App.css";

const ButtonComponent = ({ onClick, children, text }) => {
  return (
    <button onClick={onClick}>
      {text || children}
    </button>
  );
};

export default ButtonComponent;