import React from "react";
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import "../../App.css";

// Create a theme with custom colors
const theme = createTheme({
  palette: {
    orange: {
      main: '#E65100', // Darker orange for Amazon
      dark: '#BF360C', // Even darker for hover
      contrastText: '#fff',
    },
    purple: {
      main: '#4A148C', // Dark purple for JS
      dark: '#311B92', // Darker purple for hover
      contrastText: '#fff',
    },
    cyan: {
      main: '#11addb',
      contrastText: '#fff',
    }
  }
});

const ButtonComponent = ({ onClick, text, color = 'primary', sx = {} }) => (
  <ThemeProvider theme={theme}>
    <Button 
      variant="contained" 
      onClick={onClick} 
      color={color}
      sx={{
        fontWeight: 'bold',
        padding: '8px 16px',
        ...(color === 'orange' && {
          bgcolor: 'orange.main',
          color: 'orange.contrastText',
          '&:hover': {
            bgcolor: 'orange.dark',
          },
        }),
        ...(color === 'purple' && {
          bgcolor: 'purple.main',
          color: 'purple.contrastText',
          '&:hover': {
            bgcolor: 'purple.dark',
          },
        }),
        ...sx,
      }}
    >
      {text}
    </Button>
  </ThemeProvider>
);

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