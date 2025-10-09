import React from 'react';
import { Box, Typography, BoxProps, TypographyProps } from '@mui/material';
import * as styles from '../styles/commonStyles';

/**
 * Reusable layout components that encapsulate common UI patterns
 */

// ==================== Step/Page Containers ====================

interface StepContainerProps extends BoxProps {
  children: React.ReactNode;
}

export const StepContainer: React.FC<StepContainerProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.pageContainer, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

export const ContentContainer: React.FC<StepContainerProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.contentContainer, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

// ==================== Section Components ====================

interface SectionCardProps extends BoxProps {
  children: React.ReactNode;
  title?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({ children, title, sx, ...props }) => {
  return (
    <Box sx={[styles.sectionContainer, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {title && (
        <Typography variant="h6" sx={styles.sectionTitle}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
};

// ==================== Form Components ====================

interface FormGridProps extends BoxProps {
  children: React.ReactNode;
  columns?: 'auto' | 'two' | 'three';
}

export const FormGrid: React.FC<FormGridProps> = ({ children, columns = 'auto', sx, ...props }) => {
  const gridStyle = 
    columns === 'two' ? styles.formGridTwoColumn :
    columns === 'three' ? styles.formGridThreeColumn :
    styles.formGrid;

  return (
    <Box sx={[gridStyle, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

// ==================== Typography Components ====================

interface SectionTitleProps extends TypographyProps {
  children: React.ReactNode;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, sx, ...props }) => {
  return (
    <Typography variant="h6" sx={[styles.sectionTitle, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Typography>
  );
};

export const SubTitle: React.FC<SectionTitleProps> = ({ children, sx, ...props }) => {
  return (
    <Typography 
      variant="subtitle1" 
      sx={[
        { mb: 1.5, fontWeight: 600, color: 'text.primary', fontSize: '1rem' },
        ...(Array.isArray(sx) ? sx : [sx])
      ]} 
      {...props}
    >
      {children}
    </Typography>
  );
};

// ==================== Action Button Container ====================

interface ActionButtonsProps extends BoxProps {
  children: React.ReactNode;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.actionButtonsContainer, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

export const ButtonGroup: React.FC<ActionButtonsProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.buttonGroup, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

// ==================== Flex Layout Components ====================

export const FlexRow: React.FC<BoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.flexRow, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

export const FlexRowSpaced: React.FC<BoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.flexRowSpaced, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

export const FlexColumn: React.FC<BoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.flexColumn, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

// ==================== Document/Card Grid ====================

interface DocumentGridProps extends BoxProps {
  children: React.ReactNode;
  columns?: 'two' | 'three';
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({ children, columns = 'two', sx, ...props }) => {
  const gridStyle = columns === 'three' ? styles.documentGridThreeColumn : styles.documentGrid;
  
  return (
    <Box sx={[gridStyle, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

// ==================== Empty State ====================

interface EmptyStateProps {
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
  return (
    <Box sx={styles.noDataMessage}>
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

// ==================== Loading State ====================

export const LoadingSpinner: React.FC = () => {
  return (
    <Box sx={styles.loadingContainer}>
      <Box sx={styles.spinner} />
      <Typography variant="body2" color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
};

// ==================== Tab Content Container ====================

export const TabContent: React.FC<BoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box sx={[styles.tabContainer, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};

// ==================== Category Header ====================

interface CategoryHeaderProps extends BoxProps {
  icon?: React.ReactNode;
  title: string;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ icon, title, sx, ...props }) => {
  return (
    <Box sx={[styles.categoryHeader, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {icon && <Box sx={styles.iconContainer}>{icon}</Box>}
      <Typography variant="h6" sx={styles.sectionTitle} mb={0}>
        {title}
      </Typography>
    </Box>
  );
};

// ==================== Floating Action Bar ====================

interface FloatingActionBarProps extends BoxProps {
  children: React.ReactNode;
  variant?: 'centered' | 'spaced';
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({ 
  children, 
  variant = 'centered',
  sx, 
  ...props 
}) => {
  const baseStyle = variant === 'spaced' 
    ? styles.floatingActionBarSpaced 
    : styles.floatingActionBarCentered;
  
  return (
    <Box sx={[baseStyle, ...(Array.isArray(sx) ? sx : [sx])]} {...props}>
      {children}
    </Box>
  );
};
