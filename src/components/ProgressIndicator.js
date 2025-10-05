import React from 'react';
import './ProgressIndicator.css';

const ProgressIndicator = ({ currentStep = 3 }) => {
  const steps = [
    {
      id: 1,
      title: 'Generate Sample Data',
      subtitle: 'Create patient profile',
      completed: currentStep > 1
    },
    {
      id: 2,
      title: 'Review & Edit Data',
      subtitle: 'Review and modify patient information',
      completed: currentStep > 2
    },
    {
      id: 3,
      title: 'Generate Documents',
      subtitle: 'Create CMS-1500 and medical reports',
      completed: false,
      current: currentStep === 3
    }
  ];

  return (
    <div className="progress-indicator">
      {steps.map((step, index) => (
        <div key={step.id} className="progress-step-container">
          <div className={`progress-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}>
            <div className="step-circle">
              {step.completed ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span className="step-number">{step.id}</span>
              )}
            </div>
            <div className="step-content">
              <h3 className="step-title">{step.title}</h3>
              <p className="step-subtitle">{step.subtitle}</p>
            </div>
          </div>
          {index < steps.length - 1 && <div className="progress-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;