import React from 'react';
import { Card, Box, Typography, Button, CircularProgress } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DownloadIcon from '@mui/icons-material/Download';

interface DocumentCardProps {
  title: string;
  description: string;
  onPreview: () => void;
  onGenerate: () => void;
  isLoading?: boolean;
  compact?: boolean;
  iconType?: 'insurance' | 'medical' | 'visit' | 'medication' | 'lab';
}

const getIcon = (type: string = 'medical') => {
  switch (type) {
    case 'insurance':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="M2 8h20"/>
          <path d="M6 12h4"/>
          <path d="M6 16h8"/>
        </svg>
      );
    case 'visit':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
          <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          <path d="M9 12h6"/>
          <path d="M9 16h6"/>
        </svg>
      );
    case 'medication':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="2"/>
          <path d="M12 8v8"/>
          <path d="M8 12h8"/>
        </svg>
      );
    case 'lab':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3v15a3 3 0 003 3 3 3 0 003-3V3"/>
          <path d="M9 11h6"/>
          <path d="M7 3h10"/>
        </svg>
      );
    case 'medical':
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
          <path d="M12 11v6"/>
          <path d="M9 14h6"/>
        </svg>
      );
  }
};

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  title, 
  description, 
  onPreview, 
  onGenerate, 
  isLoading = false,
  compact = false,
  iconType = 'medical'
}) => {
  return (
    <Card 
      sx={{ 
        p: compact ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, width: '100%' }}>
        <Box 
          sx={{ 
            color: 'primary.main',
            p: compact ? 0.5 : 0.75,
            bgcolor: 'rgba(241, 248, 233, 1)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getIcon(iconType)}
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            flex: 1,
            fontSize: compact ? '15px' : '16px',
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: compact ? 1.3 : 1.4,
            letterSpacing: '-0.01em',
            textAlign: 'left',
          }}
        >
          {title}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 1.5, textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '13px',
            color: 'text.secondary',
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', width: '100%' }}>
        <Button 
          variant="outlined"
          onClick={onPreview}
          disabled={isLoading}
          startIcon={<VisibilityOutlinedIcon />}
          sx={{ flex: 1 }}
        >
          Preview
        </Button>
        <Button 
          variant="contained"
          color="primary"
          onClick={onGenerate}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <DownloadIcon />}
          sx={{ flex: 1 }}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </Box>
    </Card>
  );
};

export default DocumentCard;
