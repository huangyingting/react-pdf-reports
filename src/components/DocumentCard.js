import React from 'react';
import './DocumentCard.css';

const DocumentCard = ({ 
  title, 
  description, 
  onPreview, 
  onGenerate, 
  isLoading = false 
}) => {
  return (
    <div className="document-card">
      <div className="document-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      </div>
      <div className="document-content">
        <h3 className="document-title">{title}</h3>
        <p className="document-description">{description}</p>
      </div>
      <div className="document-actions">
        <button 
          className="btn btn-outline"
          onClick={onPreview}
          disabled={isLoading}
        >
          Preview
        </button>
        <button 
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;