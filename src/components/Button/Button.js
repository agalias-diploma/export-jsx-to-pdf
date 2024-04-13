import React from "react";
import "../../App.css";

const ButtonComponent = ({ onClick, children, text }) => {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {text || children}
    </button>
  );
};

export default ButtonComponent;