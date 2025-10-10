import { SxProps, Theme } from '@mui/material';

/**
 * Common reusable styles for consistent UI across the application
 * These styles follow the brown/sage color scheme and Material-UI patterns
 */

// ==================== Layout Containers ====================

export const pageContainer: SxProps<Theme> = {
  width: '100%',
  bgcolor: 'rgba(250, 245, 235, 0.80)',
  minHeight: 'calc(100vh - 200px)',
  display: 'flex',
  flexDirection: 'column',
  px: { xs: 2, sm: 3, md: 4 },
  py: 0,
};

export const contentContainer: SxProps<Theme> = {
  borderRadius: 0,
  p: 0,
  flex: 1,
};

export const sectionContainer: SxProps<Theme> = {
  bgcolor: 'background.default',
  border: '1.5px solid',
  borderColor: 'divider',
  borderRadius: 3,
  p: 3,
  mb: 3,
  boxShadow: 2,
};

// ==================== Typography ====================

export const sectionTitle: SxProps<Theme> = {
  mb: 2,
  color: 'primary.main',
  fontWeight: 700,
  fontSize: '1.125rem',
};

export const subsectionTitle: SxProps<Theme> = {
  mb: 2,
  color: 'text.primary',
  fontWeight: 600,
};

// ==================== Accordion Styles ====================

export const enhancedAccordion: SxProps<Theme> = {
  mb: 2,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: '12px !important',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  transition: 'all 0.3s ease',
  '&:before': {
    display: 'none', // Remove default MUI divider
  },
  '&:hover': {
    boxShadow: '0 4px 16px rgba(121, 85, 72, 0.15)',
    borderColor: 'primary.light',
  },
  '&.Mui-expanded': {
    margin: '0 0 16px 0',
    boxShadow: '0 4px 20px rgba(121, 85, 72, 0.2)',
    borderColor: 'primary.main',
    borderWidth: '2px',
  },
};

export const enhancedAccordionSummary: SxProps<Theme> = {
  bgcolor: 'background.paper',
  minHeight: 64,
  px: 3,
  py: 1.5,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    bgcolor: 'rgba(121, 85, 72, 0.04)',
  },
  '&.Mui-expanded': {
    minHeight: 64,
    borderBottom: '1px solid',
    borderColor: 'divider',
    bgcolor: 'rgba(121, 85, 72, 0.06)',
    borderRadius: '12px 12px 0 0',
  },
  '& .MuiAccordionSummary-content': {
    my: 1.5,
    alignItems: 'center',
    gap: 1.5,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'primary.main',
    transition: 'transform 0.3s ease, color 0.3s ease',
    '&.Mui-expanded': {
      transform: 'rotate(180deg)',
      color: 'primary.dark',
    },
  },
};

export const accordionTitle: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: '1rem',
  color: 'text.primary',
  display: 'flex',
  alignItems: 'center',
  gap: 1,
};

export const accordionBadge: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  height: 28,
  px: 1,
  borderRadius: '14px',
  bgcolor: 'primary.main',
  color: 'primary.contrastText',
  fontSize: '0.75rem',
  fontWeight: 700,
  ml: 1,
  boxShadow: '0 2px 4px rgba(121, 85, 72, 0.2)',
};

export const accordionSubtext: SxProps<Theme> = {
  ml: 1.5,
  color: 'text.secondary',
  fontSize: '0.875rem',
  fontWeight: 400,
};

export const enhancedAccordionDetails: SxProps<Theme> = {
  px: 3,
  py: 3,
  bgcolor: 'rgba(250, 245, 235, 0.5)',
  borderTop: '1px solid',
  borderColor: 'divider',
};

export const labelText: SxProps<Theme> = {
  fontWeight: 600,
  color: 'text.secondary',
};

// ==================== Form Layouts ====================

export const formGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 1.5,
};

export const formGridTwoColumn: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 1.5,
};

export const formGridThreeColumn: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
  gap: 1.5,
};

export const fullWidthField: SxProps<Theme> = {
  gridColumn: 'span 2',
};

// ==================== Flexbox Layouts ====================

export const flexRow: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

export const flexRowSpaced: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
};

export const flexColumn: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const flexWrap: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
};

export const flexWrapResponsive: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  '& > *': { flex: '1 1 300px', minWidth: '250px' },
};

// ==================== Card Styles ====================

export const cardBase: SxProps<Theme> = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1.5px solid',
  borderColor: 'divider',
  borderRadius: 3,
  transition: 'all 0.2s ease-in-out',
};

export const cardHoverable: SxProps<Theme> = {
  ...cardBase,
  '&:hover': {
    boxShadow: 4,
    borderColor: 'primary.light',
    transform: 'translateY(-2px)',
  },
};

export const cardClickable: SxProps<Theme> = {
  ...cardHoverable,
  cursor: 'pointer',
  '&:hover': {
    ...(cardHoverable as any)['&:hover'],
    bgcolor: 'rgba(241, 248, 233, 0.15)',
  },
};

// ==================== Action Buttons ====================

export const actionButtonsContainer: SxProps<Theme> = {
  p: 2,
  minHeight: 72,
  borderTop: '1.5px solid',
  borderColor: 'divider',
  bgcolor: 'background.default',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 2,
  '& .MuiButton-root': {
    height: 40,
    minHeight: 40,
  },
};

export const buttonGroup: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
};

// ==================== Grid Layouts ====================

export const responsiveGrid: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: 2,
};

export const responsiveGridLarge: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 2,
};

// ==================== Loading States ====================

export const loadingContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 200px)',
  gap: 2,
};

export const spinner: SxProps<Theme> = {
  width: 40,
  height: 40,
  border: '4px solid',
  borderColor: 'divider',
  borderTopColor: 'primary.main',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

// ==================== Empty States ====================

export const emptyStateContainer: SxProps<Theme> = {
  textAlign: 'center',
  p: 8,
  bgcolor: 'white',
  borderRadius: 3,
  m: 4,
  boxShadow: 2,
};

export const noDataMessage: SxProps<Theme> = {
  textAlign: 'center',
  p: 4,
  color: 'text.secondary',
};

// ==================== Accordion Styles ====================

export const accordionContainer: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

// ==================== Icon Containers ====================

export const iconContainer: SxProps<Theme> = {
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
};

export const iconBox: SxProps<Theme> = {
  width: 40,
  height: 40,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bgcolor: 'primary.light',
  color: 'primary.main',
};

// ==================== Category Headers ====================

export const categoryHeader: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 3,
  pb: 1.5,
  borderBottom: '2px solid',
  borderColor: 'rgba(107, 142, 35, 0.15)',
};

// ==================== Dividers ====================

export const sectionDivider: SxProps<Theme> = {
  borderTop: '1.5px solid',
  borderColor: 'divider',
  my: 3,
};

// ==================== Badge/Chip Styles ====================

export const statusBadge: SxProps<Theme> = {
  px: 1.5,
  py: 0.5,
  borderRadius: 1,
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
};

// ==================== Settings/Form Field Groups ====================

export const fieldGroup: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
};

// ==================== Responsive Document Grid ====================

export const documentGrid: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  '& > *': { 
    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)' }, 
    minWidth: { xs: '100%', sm: '280px' },
  },
};

export const documentGridThreeColumn: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  '& > *': { 
    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.333% - 16px)' }, 
    minWidth: { xs: '100%', sm: '280px' },
  },
};

// ==================== Tab Container ====================

export const tabContainer: SxProps<Theme> = {
  p: 2.5,
  flex: 1,
  border: '2px solid',
  borderColor: 'rgba(107, 142, 35, 0.15)',
  borderRadius: 2,
  bgcolor: 'background.paper',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
};

// ==================== Floating Action Bar ====================

export const floatingActionBar: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  px: 3,
  py: 2,
  minHeight: 80,
  maxHeight: 80,
  background: 'linear-gradient(135deg, rgba(250, 248, 243, 0.95) 0%, rgba(245, 241, 232, 0.95) 100%)',
  backdropFilter: 'blur(12px)',
  border: '2px solid',
  borderColor: 'rgba(107, 142, 35, 0.2)',
  borderRadius: 3,
  boxShadow: '0 8px 24px rgba(107, 142, 35, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08)',
  position: 'fixed',
  bottom: 24,
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'fit-content',
  minWidth: { xs: 'calc(100% - 48px)', sm: 'auto' },
  zIndex: 1000,
  overflow: 'hidden',
  '& .MuiButton-root': {
    height: 44,
    minHeight: 44,
    maxHeight: 44,
    px: 3,
    py: 0,
    fontSize: '0.9375rem',
    fontWeight: 700,
    borderRadius: 2.5,
    textTransform: 'none',
    whiteSpace: 'nowrap',
  },
  '& .MuiBox-root': {
    display: 'flex',
    gap: 2,
    alignItems: 'center',
    height: '100%',
  },
};

export const floatingActionBarCentered: SxProps<Theme> = {
  ...floatingActionBar,
  justifyContent: 'center',
  maxWidth: { xs: 'calc(100% - 48px)', sm: 700 },
};

export const floatingActionBarSpaced: SxProps<Theme> = {
  ...floatingActionBar,
  justifyContent: 'space-between',
  maxWidth: { xs: 'calc(100% - 48px)', sm: 'calc(100% - 48px)', md: 1000 },
  px: 4,
};

// ==================== Gradient Backgrounds ====================

export const gradientBackground: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faf9 100%)',
};

export const gradientBackgroundLight: SxProps<Theme> = {
  background: 'linear-gradient(135deg, rgba(241, 248, 233, 1) 0%, rgba(143, 175, 60, 0.15) 100%)',
};

export const gradientBackgroundSubtle: SxProps<Theme> = {
  background: 'linear-gradient(180deg, rgba(250, 248, 243, 1) 0%, rgba(245, 241, 232, 0.95) 100%)',
};

export const gradientPrimary: SxProps<Theme> = {
  background: 'linear-gradient(135deg, #6b8e23 0%, #8faf3c 100%)',
};

// ==================== Enhanced Card Styles ====================

export const enhancedCard: SxProps<Theme> = {
  p: { xs: 2.5, sm: 3.5 },
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  minWidth: 0,
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faf9 100%)',
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'rgba(107, 142, 35, 0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 28px rgba(107, 142, 35, 0.12), 0 4px 12px rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(107, 142, 35, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #6b8e23, #8faf3c, #6b8e23)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::before': {
    opacity: 1,
  },
};

export const settingsCard: SxProps<Theme> = {
  p: 3.5,
  borderRadius: 3,
  background: 'linear-gradient(135deg, #ffffff 0%, #f8faf9 100%)',
  border: '2px solid',
  borderColor: 'rgba(107, 142, 35, 0.12)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
  mb: 3,
};

// ==================== Icon Containers with Animations ====================

export const animatedIconBox: SxProps<Theme> = {
  color: 'primary.main',
  p: { xs: 1, sm: 1.25 },
  background: 'linear-gradient(135deg, rgba(241, 248, 233, 1) 0%, rgba(143, 175, 60, 0.15) 100%)',
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  boxShadow: '0 2px 8px rgba(107, 142, 35, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

// ==================== Button Variants ====================

export const primaryButton: SxProps<Theme> = {
  borderRadius: 2,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  height: 40,
  minHeight: 40,
  boxShadow: '0 2px 8px rgba(107, 142, 35, 0.25)',
  background: 'linear-gradient(135deg, #6b8e23 0%, #8faf3c 100%)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 6px 16px rgba(107, 142, 35, 0.35)',
  },
};

export const outlinedButton: SxProps<Theme> = {
  borderRadius: 2,
  borderWidth: 1.5,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  height: 40,
  minHeight: 40,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderWidth: 1.5,
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
  },
};

export const smallIconButton: SxProps<Theme> = {
  borderRadius: 2,
  px: 2,
  height: 36,
  minHeight: 36,
  fontSize: '0.875rem',
  textTransform: 'none',
  fontWeight: 600,
};

// ==================== Floating Action Bar Button Styles ====================

export const floatingActionButton: SxProps<Theme> = {
  height: 44,
  minHeight: 44,
  maxHeight: 44,
  px: 4,
  fontSize: '1rem',
  fontWeight: 700,
  borderRadius: 2.5,
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
};

export const floatingActionButtonPrimary: SxProps<Theme> = {
  ...floatingActionButton,
  boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
  background: 'linear-gradient(135deg, #6b8e23 0%, #8faf3c 100%)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(107, 142, 35, 0.4)',
  },
  '&:disabled': {
    background: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
  },
};

export const floatingActionButtonOutlined: SxProps<Theme> = {
  ...floatingActionButton,
  borderWidth: 2,
  '&:hover': {
    borderWidth: 2,
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
  },
};

export const floatingActionButtonSecondary: SxProps<Theme> = {
  ...floatingActionButton,
  px: 3,
  boxShadow: '0 4px 12px rgba(109, 76, 65, 0.3)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(109, 76, 65, 0.4)',
  },
};

export const floatingActionButtonBack: SxProps<Theme> = {
  ...floatingActionButtonOutlined,
  minWidth: 140,
  px: 3,
  fontSize: '0.9375rem',
  fontWeight: 600,
  '&:hover': {
    borderWidth: 2,
    transform: 'translateX(-4px)',
    boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
  },
};

// ==================== Form Control Styles ====================

export const formControlSelect: SxProps<Theme> = {
  borderRadius: 2,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    py: 1.5,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: 1.5,
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
};

export const formControlCheckbox: SxProps<Theme> = {
  border: '2px solid',
  borderColor: 'divider',
  borderRadius: 2,
  px: 2,
  py: 0.5,
  m: 0,
  minHeight: '40px',
  height: '40px',
  background: 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'primary.main',
    boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
  },
};

export const formControlCheckboxActive: SxProps<Theme> = {
  ...formControlCheckbox,
  borderColor: 'primary.main',
  background: 'linear-gradient(135deg, rgba(241, 248, 233, 0.6) 0%, rgba(143, 175, 60, 0.1) 100%)',
};

// ==================== Radio Button Styles ====================

export const radioButtonCard: SxProps<Theme> = {
  border: '1.5px solid',
  borderColor: 'divider',
  borderRadius: 2,
  px: 1.5,
  m: 0,
  background: 'transparent',
  transition: 'all 0.2s ease',
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
  },
  '&:hover': {
    borderColor: 'primary.main',
    boxShadow: '0 2px 8px rgba(107, 142, 35, 0.12)',
    transform: 'translateY(-1px)',
  },
};

export const radioButtonCardActive: SxProps<Theme> = {
  ...radioButtonCard,
  borderColor: 'primary.main',
  background: 'linear-gradient(135deg, rgba(241, 248, 233, 0.6) 0%, rgba(143, 175, 60, 0.1) 100%)',
};

// ==================== Icon Button Styles ====================

export const iconButton: SxProps<Theme> = {
  border: '1.5px solid',
  borderColor: 'divider',
  borderRadius: 2,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'primary.main',
    color: 'primary.main',
    transform: 'scale(1.1)',
  }
};

export const iconButtonError: SxProps<Theme> = {
  border: '1.5px solid',
  borderColor: 'divider',
  borderRadius: 2,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'error.main',
    color: 'error.main',
    transform: 'rotate(90deg)',
  }
};

// ==================== Preset/Option Card Styles ====================

export const presetCard: SxProps<Theme> = {
  p: 2.5,
  borderRadius: 2.5,
  border: '2px solid',
  borderColor: 'divider',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: 'white',
  '&:hover': {
    borderColor: 'rgba(107, 142, 35, 0.4)',
    boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
    transform: 'translateY(-2px)',
  },
};

export const presetCardActive: SxProps<Theme> = {
  ...presetCard,
  borderColor: 'primary.main',
  background: 'linear-gradient(135deg, rgba(241, 248, 233, 0.8) 0%, rgba(143, 175, 60, 0.15) 100%)',
  boxShadow: '0 4px 12px rgba(107, 142, 35, 0.2)',
};

// ==================== Badge/Indicator Styles ====================

export const badgeIndicator: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  borderRadius: '50%',
  bgcolor: 'primary.main',
  color: 'white',
  boxShadow: '0 2px 8px rgba(107, 142, 35, 0.3)',
  transition: 'all 0.2s ease',
};

export const badgeSmall: SxProps<Theme> = {
  px: 1.5,
  py: 0.5,
  bgcolor: 'rgba(241, 248, 233, 1)',
  color: 'primary.main',
  borderRadius: 1.5,
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid',
  borderColor: 'rgba(107, 142, 35, 0.3)',
};

// ==================== Tab Styles ====================

export const customTabs: SxProps<Theme> = {
  minHeight: 56,
  maxWidth: 1200,
  m: 0,
  p: 0,
  '& .MuiTab-root': {
    minHeight: 56,
    textTransform: 'none',
    fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
    fontWeight: 600,
    minWidth: { xs: 100, sm: 120, md: 140 },
    color: 'text.secondary',
    transition: 'all 0.2s ease',
    borderRadius: '8px 8px 0 0',
    mx: 0,
    py: 1.25,
    px: { xs: 1.5, sm: 2, md: 2.5 },
    '&:hover': {
      color: 'primary.main',
      bgcolor: 'rgba(107, 142, 35, 0.08)',
      transform: 'translateY(-2px)',
    },
    '&.Mui-selected': {
      color: 'primary.main',
      bgcolor: 'rgba(241, 248, 233, 0.9)',
      fontWeight: 700,
      boxShadow: '0 -2px 8px rgba(107, 142, 35, 0.12)',
    },
  },
  '& .MuiTabs-indicator': {
    height: 3,
    borderRadius: '3px 3px 0 0',
    background: 'linear-gradient(90deg, #6b8e23, #8faf3c)',
    boxShadow: '0 2px 4px rgba(107, 142, 35, 0.3)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.125rem',
  },
  '& .MuiTabs-scrollButtons': {
    color: 'primary.main',
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
};

export const tabsContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, rgba(250, 248, 243, 1) 0%, rgba(245, 241, 232, 0.95) 100%)',
  m: 0,
  p: 0,
};

// ==================== Field Label Styles ====================

export const fieldLabel: SxProps<Theme> = {
  fontSize: '0.9rem',
  fontWeight: 700,
  color: 'text.primary',
};

export const fieldCaption: SxProps<Theme> = {
  lineHeight: 1.5,
  color: 'text.secondary',
};

// ==================== Section Header with Icon ====================

export const sectionHeaderWithIcon: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  mb: 3,
  pb: 1.5,
  borderBottom: '2px solid',
  borderColor: 'rgba(107, 142, 35, 0.15)',
};

export const sectionIconBox: SxProps<Theme> = {
  p: 1,
  bgcolor: 'rgba(241, 248, 233, 1)',
  borderRadius: 2,
  color: 'primary.main',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// ==================== Preview Modal Styles ====================

export const previewModal: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '1rem',
};

export const previewContent: SxProps<Theme> = {
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
  maxWidth: '90vw',
  maxHeight: '80vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  animation: 'modalSlideIn 0.3s ease',
  '@keyframes modalSlideIn': {
    from: {
      opacity: 0,
      transform: 'translateY(-20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
};

export const previewHeader: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 1.25rem',
  borderBottom: '1px solid #e0e0e0',
  '& h3': {
    margin: 0,
    color: '#3e2723',
    fontSize: '1.25rem',
    fontWeight: 600,
  },
};

export const closePreview: SxProps<Theme> = {
  background: 'none',
  border: 'none',
  fontSize: '2rem',
  color: '#8d6e63',
  cursor: 'pointer',
  padding: 0,
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: '#f5f1e8',
    color: '#3e2723',
  },
};

export const previewBody: SxProps<Theme> = {
  flex: 1,
  overflow: 'auto',
  padding: '1.5rem',
  position: 'relative',
};

export const previewBodyWithWatermark: SxProps<Theme> = {
  ...previewBody,
  '&::before, &::after': {
    content: '"Educational Use Only"',
    position: 'absolute',
    fontSize: '4rem',
    fontWeight: 'bold',
    color: '#999999',
    opacity: 0.22,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    fontFamily: "'Helvetica', 'Arial', sans-serif",
    zIndex: 10,
  },
  '&::before': {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
  },
  '&::after': {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(45deg)',
    opacity: 0.15,
  },
};

export const previewWatermarkOverlay: SxProps<Theme> = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  zIndex: 5,
};

export const previewWatermarkText: SxProps<Theme> = {
  position: 'absolute',
  fontSize: '3.5rem',
  fontWeight: 'bold',
  color: '#999999',
  opacity: 0.18,
  whiteSpace: 'nowrap',
  fontFamily: "'Helvetica', 'Arial', sans-serif",
  '&:nth-of-type(1)': {
    top: '20%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
  },
  '&:nth-of-type(2)': {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
  },
  '&:nth-of-type(3)': {
    top: '80%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
  },
  '&:nth-of-type(4)': {
    top: '35%',
    left: '25%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.15,
  },
  '&:nth-of-type(5)': {
    top: '65%',
    left: '75%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    opacity: 0.15,
  },
};

export const reportDisplay: SxProps<Theme> = {
  position: 'absolute',
  left: '-9999px',
  top: '-9999px',
  opacity: 0,
  pointerEvents: 'none',
};

// ==================== Helper Functions ====================

/**
 * Merge multiple sx props objects
 */
export const mergeSx = (...sxProps: (SxProps<Theme> | undefined)[]): SxProps<Theme> => {
  const filtered = sxProps.filter((sx): sx is SxProps<Theme> => sx !== undefined);
  return filtered.reduce((acc, sx) => {
    if (Array.isArray(sx)) {
      return [...(Array.isArray(acc) ? acc : [acc]), ...sx];
    }
    return Array.isArray(acc) ? [...acc, sx] : [acc, sx];
  }, {} as SxProps<Theme>);
};

/**
 * Create a conditional sx prop
 */
export const conditionalSx = (
  condition: boolean,
  trueSx: SxProps<Theme>,
  falseSx?: SxProps<Theme>
): SxProps<Theme> => {
  return condition ? trueSx : (falseSx || {});
};
