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
};

export const contentContainer: SxProps<Theme> = {
  borderRadius: 0,
  p: 2,
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
  borderTop: '1.5px solid',
  borderColor: 'divider',
  bgcolor: 'background.default',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 2,
};

export const buttonGroup: SxProps<Theme> = {
  display: 'flex',
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
  '& > *': { flex: '1 1 calc(50% - 16px)', minWidth: '300px' },
};

export const documentGridThreeColumn: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 2,
  '& > *': { flex: '1 1 calc(33.333% - 16px)', minWidth: '280px' },
};

// ==================== Tab Container ====================

export const tabContainer: SxProps<Theme> = {
  p: 2.5,
  flex: 1,
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
