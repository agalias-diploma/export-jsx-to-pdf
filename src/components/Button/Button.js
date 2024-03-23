import React from "react"
import "../../App.css"

const Button = ({ onClick, isViewerVisible }) => {
  return (
    <button onClick={onClick}>
      {isViewerVisible ? "Hide PDF" : "Show PDF"}
    </button>
  )
}

export default Button