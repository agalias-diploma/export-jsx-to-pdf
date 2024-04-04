import React from "react"
import "../../App.css"

const Button = ({ onClick, isViewerVisible }) => {
  return (
    <button onClick={onClick}>
      {isViewerVisible ? "Hide PDF" : "Show PDF"}
    </button>
  )
}

const ButtonComponent = ({ onClick, children }) => {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

module.exports = {
  Button,
  ButtonComponent,
}