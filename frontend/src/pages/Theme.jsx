import { createTheme, ThemeProvider } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        primary: {
          main: '#3f51b5',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      }
      : {
        primary: {
          main: '#90caf9',
        },
        secondary: {
          main: '#f48fb1',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      }),
  },
  transitions: {
    easing: {
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});