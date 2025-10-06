import React from 'react';
import './ProgressIndicator.css';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Generate Data', description: 'Create sample medical records' },
    { number: 2, label: 'Edit Data', description: 'Review and customize' },
    { number: 3, label: 'Export Documents', description: 'Generate PDF files' }
  ];

  return (
    <div className="progress-indicator">
      <div className="progress-steps">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className={`progress-step ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
              <div className="step-circle">
                {currentStep > step.number ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
            {index < steps.length - 1 && (
              <div className={`progress-connector ${currentStep > step.number ? 'completed' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
