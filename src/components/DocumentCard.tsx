import React from 'react';
import './DocumentCard.css';

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
    <div className={`document-card${compact ? ' compact' : ''}`}>
      <div className="document-header">
        <div className="document-icon">
          {getIcon(iconType)}
        </div>
        <h3 className="document-title">{title}</h3>
      </div>
      <div className="document-content">
        <p className="document-description">{description}</p>
      </div>
      <div className="document-actions">
        <button 
          className="btn btn-outline"
          onClick={onPreview}
          disabled={isLoading}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          <span>Preview</span>
        </button>
        <button 
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-animation">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
