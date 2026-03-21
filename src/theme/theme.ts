import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#4F46E5',
      light: '#6366F1',
      dark: '#4338CA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    success: {
      main: '#16A34A',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#DC2626',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#D97706',
      contrastText: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    h1: {
      fontSize: '32px',
      lineHeight: 1.2,
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '24px',
      lineHeight: 1.25,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '20px',
      lineHeight: 1.3,
      fontWeight: 600,
    },
    body1: {
      fontSize: '16px',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.45,
      fontWeight: 400,
    },
    caption: {
      fontSize: '12px',
      lineHeight: 1.4,
      fontWeight: 500,
    },
    button: {
      fontSize: '14px',
      lineHeight: 1.2,
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F9FAFB',
          color: '#111827',
          margin: 0,
        },
        '*': {
          boxSizing: 'border-box',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: 'large',
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 10,
          paddingLeft: 16,
          paddingRight: 16,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          boxShadow: '0 1px 2px rgba(17, 24, 39, 0.04)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          '&:last-child': {
            paddingBottom: 20,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
        },
        notchedOutline: {
          borderColor: '#E5E7EB',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'transparent',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          borderBottom: '1px solid #E5E7EB',
          color: '#111827',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'sm',
      },
    },
  },
});
