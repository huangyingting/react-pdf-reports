import { createTheme } from '@mui/material/styles';

// Skilljar-inspired color palette
const skilljarTheme = createTheme({
  palette: {
    primary: {
      main: '#36b0e6', // Skilljar blue
      light: '#7acbee',
      dark: '#1694d1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#5a697c', // Medium gray
      light: '#8190a4',
      dark: '#4f5c6d',
      contrastText: '#fff',
    },
    error: {
      main: '#c60f13',
      light: '#d32f2f',
      dark: '#970b0e',
      contrastText: '#fff',
    },
    warning: {
      main: '#f57c00',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#fff',
    },
    success: {
      main: '#4d4d4d',
      light: '#6f6f6f',
      dark: '#343434',
      contrastText: '#fff',
    },
    info: {
      main: '#1694d1',
      light: '#36b0e6',
      dark: '#1173a3',
      contrastText: '#fff',
    },
    background: {
      default: '#eee',
      paper: '#fff',
    },
    text: {
      primary: '#222',
      secondary: '#555',
      disabled: '#999',
    },
    divider: '#d5d5d5',
  },
  typography: {
    fontFamily: '"Lato", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.75em',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#222',
    },
    h2: {
      fontSize: '2.3125em',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#222',
    },
    h3: {
      fontSize: '1.6875em',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#222',
    },
    h4: {
      fontSize: '1.4375em',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#222',
    },
    h5: {
      fontSize: '1.125em',
      fontWeight: 400,
      lineHeight: 1.4,
      color: '#222',
    },
    h6: {
      fontSize: '1em',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#222',
    },
    body1: {
      fontSize: '1em',
      lineHeight: 1.6,
      color: '#222',
    },
    body2: {
      fontSize: '0.875em',
      lineHeight: 1.6,
      color: '#555',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875em',
    },
    caption: {
      fontSize: '0.75em',
      color: '#6f6f6f',
    },
  },
  shape: {
    borderRadius: 4,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.08)',
    '0 2px 4px rgba(0, 0, 0, 0.1)',
    '0 4px 6px rgba(0, 0, 0, 0.1)',
    '0 4px 12px rgba(0, 0, 0, 0.15)',
    '0 6px 12px rgba(0, 0, 0, 0.15)',
    '0 8px 16px rgba(0, 0, 0, 0.15)',
    '0 12px 24px rgba(0, 0, 0, 0.15)',
    '0 16px 32px rgba(0, 0, 0, 0.15)',
    '0 20px 40px rgba(0, 0, 0, 0.15)',
    '0 24px 48px rgba(0, 0, 0, 0.15)',
    '0 28px 56px rgba(0, 0, 0, 0.15)',
    '0 32px 64px rgba(0, 0, 0, 0.15)',
    '0 36px 72px rgba(0, 0, 0, 0.15)',
    '0 40px 80px rgba(0, 0, 0, 0.15)',
    '0 44px 88px rgba(0, 0, 0, 0.15)',
    '0 48px 96px rgba(0, 0, 0, 0.15)',
    '0 52px 104px rgba(0, 0, 0, 0.15)',
    '0 56px 112px rgba(0, 0, 0, 0.15)',
    '0 60px 120px rgba(0, 0, 0, 0.15)',
    '0 64px 128px rgba(0, 0, 0, 0.15)',
    '0 68px 136px rgba(0, 0, 0, 0.15)',
    '0 72px 144px rgba(0, 0, 0, 0.15)',
    '0 76px 152px rgba(0, 0, 0, 0.15)',
    '0 80px 160px rgba(0, 0, 0, 0.15)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          padding: '0.75em 1.5em',
          fontSize: '0.875em',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 250ms ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            backgroundColor: '#fff',
            transition: 'all 150ms ease-in-out',
            '&:hover fieldset': {
              borderColor: '#bac2cd',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#003d7a',
              borderWidth: '1px',
              boxShadow: '0 0 0 3px #99c2eb',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: '1px solid #d5d5d5',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'all 250ms ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          color: '#222',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #d5d5d5',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          fontWeight: 600,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          '&:focus': {
            borderRadius: 3,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 400,
          fontSize: '1rem',
          minHeight: 48,
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #d5d5d5',
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          height: 6,
        },
      },
    },
  },
});

export default skilljarTheme;
