import React from "react";
import "./ButtonGroup.css";

import { ButtonGroup } from "@mui/material";

const ButtonSet = ({ children }) => {
  return (
    // <Container className={classes.container}>
    <ButtonGroup
      className="component-set"
      variant="contained"
      aria-label="Basic button group"
      justifyContent="center"
    >
      {children}
    </ButtonGroup>
  );
};

export default ButtonSet;
