import { createTheme } from '@mui/material/styles';

// Custom color palette matching the existing CSS design
const theme = createTheme({
  palette: {
    primary: {
      main: '#6b8e23', // Sage green
      light: '#8faf3c',
      dark: '#556b2f',
      contrastText: '#faf8f3',
    },
    secondary: {
      main: '#6d4c41', // Brown
      light: '#8d6e63',
      dark: '#5d4037',
      contrastText: '#faf8f3',
    },
    background: {
      default: '#faf8f3', // Cream background
      paper: '#f5f1e8', // Light cream
    },
    text: {
      primary: '#3e2723', // Dark brown
      secondary: '#5d4037', // Medium brown
    },
    error: {
      main: '#ef5350',
      light: '#ffebee',
    },
    success: {
      main: '#66bb6a',
      light: '#e8f5e9',
    },
    divider: '#d7ccc8',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    h1: {
      fontSize: '1.75rem',
      fontWeight: 700,
      color: '#3e2723',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#3e2723',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: '#3e2723',
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#5d4037',
      letterSpacing: '-0.005em',
    },
    body1: {
      fontSize: '0.9375rem',
      color: '#6d4c41',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      color: '#6d4c41',
      lineHeight: 1.6,
    },
    button: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.08)',
    '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
    '0 2px 8px rgba(62, 39, 35, 0.08), 0 1px 3px rgba(62, 39, 35, 0.06)',
    '0 4px 12px rgba(62, 39, 35, 0.12)',
    '0 4px 16px rgba(62, 39, 35, 0.15), 0 2px 8px rgba(62, 39, 35, 0.1)',
    '0 4px 24px rgba(62, 39, 35, 0.15), 0 2px 8px rgba(62, 39, 35, 0.1)',
    '0 8px 24px rgba(107, 142, 35, 0.25)',
    '0 8px 24px rgba(107, 142, 35, 0.3)',
    '0 10px 40px rgba(0, 0, 0, 0.3)',
    '0 4px 12px rgba(78, 52, 46, 0.3)',
    '0 4px 16px rgba(62, 39, 35, 0.15), 0 2px 8px rgba(62, 39, 35, 0.1)',
    '0 4px 12px rgba(85, 107, 47, 0.3)',
    '0 2px 6px rgba(78, 52, 46, 0.2)',
    '0 2px 6px rgba(85, 107, 47, 0.2)',
    '0 2px 8px rgba(62, 39, 35, 0.08)',
    '0 4px 16px rgba(93, 64, 55, 0.3), 0 0 0 6px rgba(109, 76, 65, 0.15)',
    '0 8px 24px rgba(107, 142, 35, 0.25)',
    '0 8px 24px rgba(107, 142, 35, 0.3)',
    '0 10px 40px rgba(0, 0, 0, 0.3)',
    '0 4px 12px rgba(78, 52, 46, 0.3)',
    '0 4px 12px rgba(85, 107, 47, 0.3)',
    '0 2px 6px rgba(78, 52, 46, 0.2)',
    '0 2px 6px rgba(85, 107, 47, 0.2)',
    '0 4px 24px rgba(62, 39, 35, 0.15), 0 2px 8px rgba(62, 39, 35, 0.1)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '0.75rem 1.5rem',
          fontSize: '0.9375rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.01em',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
          '&.Mui-disabled': {
            opacity: 0.6,
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #6d4c41 0%, #5d4037 100%)',
            border: '1.5px solid #6d4c41',
            color: '#faf8f3',
            '&:hover': {
              background: 'linear-gradient(135deg, #5d4037 0%, #4e342e 100%)',
              borderColor: '#5d4037',
              boxShadow: '0 4px 12px rgba(78, 52, 46, 0.3)',
            },
          },
          '&.MuiButton-containedSecondary': {
            background: 'linear-gradient(135deg, #6b8e23 0%, #556b2f 100%)',
            border: '1.5px solid #6b8e23',
            color: '#faf8f3',
            '&:hover': {
              background: 'linear-gradient(135deg, #556b2f 0%, #3d5117 100%)',
              borderColor: '#556b2f',
              boxShadow: '0 4px 12px rgba(85, 107, 47, 0.3)',
            },
          },
        },
        outlined: {
          background: '#faf8f3',
          border: '1.5px solid #bcaaa4',
          color: '#5d4037',
          '&:hover': {
            background: 'linear-gradient(135deg, #f5f1e8 0%, #efebe2 100%)',
            borderColor: '#8d6e63',
            color: '#4e342e',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#faf8f3',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#bcaaa4',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': {
              borderColor: '#8d6e63',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6b8e23',
              boxShadow: '0 0 0 4px rgba(107, 142, 35, 0.15)',
            },
            '& input': {
              padding: '0.625rem 0.875rem',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: '#5d4037',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#faf8f3',
          borderRadius: 8,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#bcaaa4',
            borderWidth: '1.5px',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#8d6e63',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6b8e23',
            boxShadow: '0 0 0 4px rgba(107, 142, 35, 0.15)',
          },
          '& .MuiSelect-select': {
            padding: '0.625rem 0.875rem',
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: '#5d4037',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          backgroundColor: '#faf8f3',
          color: '#5d4037',
          fontSize: '0.9375rem',
          padding: '0.625rem 0.875rem',
          transition: 'all 0.15s ease',
          '&:hover': {
            backgroundColor: '#f5f1e8',
          },
          '&.Mui-selected': {
            backgroundColor: '#e8f5e9',
            '&:hover': {
              backgroundColor: '#dcedc8',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%)',
          border: '1.5px solid #d7ccc8',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #6b8e23 0%, #8d6e63 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover': {
            boxShadow: '0 8px 24px rgba(107, 142, 35, 0.25)',
            transform: 'translateY(-2px)',
            '&::before': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#bcaaa4',
          '&.Mui-checked': {
            color: '#6b8e23',
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#bcaaa4',
          '&.Mui-checked': {
            color: '#6b8e23',
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          padding: '1rem 0',
        },
      },
    },
    MuiStep: {
      styleOverrides: {
        root: {
          '& .MuiStepConnector-line': {
            borderColor: '#d7ccc8',
            borderTopWidth: 3,
          },
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#8d6e63',
          '&.Mui-active': {
            color: '#3e2723',
            fontWeight: 700,
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          width: 48,
          height: 48,
          color: '#faf8f3',
          border: '3px solid #d7ccc8',
          borderRadius: '50%',
          '& .MuiStepIcon-text': {
            fill: '#a1887f',
            fontSize: '1.125rem',
            fontWeight: 700,
          },
          '&.Mui-active': {
            color: '#6d4c41',
            border: '3px solid #6d4c41',
            boxShadow: '0 4px 16px rgba(93, 64, 55, 0.3), 0 0 0 6px rgba(109, 76, 65, 0.15)',
            '& .MuiStepIcon-text': {
              fill: '#faf8f3',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          fontWeight: 600,
          color: '#8d6e63',
          textTransform: 'none',
          padding: '0.75rem 1.5rem',
          minHeight: 48,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&.Mui-selected': {
            color: '#3e2723',
            fontWeight: 700,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#faf8f3',
          borderRadius: 12,
          border: '1.5px solid #d7ccc8',
          padding: '0.5rem',
        },
        indicator: {
          height: 3,
          background: 'linear-gradient(90deg, #6b8e23 0%, #8d6e63 100%)',
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(to bottom, #faf8f3 0%, #f5f1e8 100%)',
          color: '#3e2723',
          boxShadow: '0 4px 12px rgba(62, 39, 35, 0.12)',
          borderBottom: '2px solid #d7ccc8',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-2px',
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, #6b8e23 0%, #8d6e63 50%, #a1887f 100%)',
            opacity: 0.6,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#f9e7be',
          color: '#6d4c41',
          border: '1px solid #d4a574',
          fontSize: '0.75rem',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#faf8f3',
          borderRadius: 12,
          border: '1.5px solid #d7ccc8',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#5d4037',
          letterSpacing: '0.01em',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#5d4037',
          letterSpacing: '0.01em',
        },
      },
    },
  },
});

export default theme;
