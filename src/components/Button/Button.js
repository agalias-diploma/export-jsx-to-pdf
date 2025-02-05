import React from "react";
import "../../App.css";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';


// Need to play with custom colors later
const theme = createTheme({
  palette: {
    aws: {
      main: '#f57c00',
      contrastText: '#FFFFFF',
    }
  },
});

const ButtonComponent = ({ onClick, children, text }) => {
  return (
    <Button variant="contained" onClick={onClick}>
      {text || children}
    </Button>
  );
};

// const ButtonComponentCustomColors = ({ onClick, children, text, color }) => {
//   return (
//     <ThemeProvider theme={theme}>
//       <Button variant={color} onClick={onClick}>
//         {text || children}
//       </Button>
//     </ThemeProvider>
//   );
// };


// const components = { ButtonComponent, ButtonComponentCustomColors };

export default ButtonComponent;