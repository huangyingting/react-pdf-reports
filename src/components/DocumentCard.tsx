import React from 'react';
import './DocumentCard.css';

interface DocumentCardProps {
  title: string;
  description: string;
  onPreview: () => void;
  onGenerate: () => void;
  isLoading?: boolean;
  compact?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  title, 
  description, 
  onPreview, 
  onGenerate, 
  isLoading = false,
  compact = false
}) => {
  return (
    <div className={`document-card${compact ? ' compact' : ''}`}>
      <div className="document-header">
        <div className="document-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10,9 9,9 8,9"/>
          </svg>
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
