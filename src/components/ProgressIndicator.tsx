import React from 'react';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Generate', description: 'Create sample medical records' },
    { number: 2, label: 'Edit', description: 'Review and customize' },
    { number: 3, label: 'Export', description: 'Generate PDF files' }
  ];

  return (
    <div className="progress-indicator">
      <div className="progress-steps">
        {steps.map((step) => (
          <div 
            key={step.number}
            className={`progress-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {currentStep > step.number ? (
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span>{step.number}</span>
              )}
            </div>
            <div className="step-info">
              <div className="step-label">{step.label}</div>
              <div className="step-description">{step.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
