import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Generate', description: 'Create sample medical records' },
    { label: 'Edit', description: 'Review and customize' },
    { label: 'Export', description: 'Generate PDF files' }
  ];

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        pt: 2,
        m: 0,
        width: '100%',
        bgcolor: 'rgba(250, 245, 235, 0.80)',
      }}
    >
      <Stepper 
        activeStep={currentStep - 1} 
        sx={{ 
          gap: 6,
          position: 'relative',
        }}
      >
        {steps.map((step, index) => (
          <Step 
            key={step.label}
            completed={currentStep > index + 1}
          >
            <StepLabel
              StepIconProps={{
                icon: currentStep > index + 1 ? <CheckIcon /> : index + 1,
              }}
              sx={{
                '& .MuiStepLabel-labelContainer': {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.375,
                  textAlign: 'left',
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.125rem',
                  fontWeight: currentStep === index + 1 ? 700 : 600,
                  color: currentStep === index + 1 ? 'text.primary' : 'secondary.light',
                  lineHeight: 1.4,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                  transition: 'all 0.3s ease',
                  transform: currentStep === index + 1 ? 'translateY(-1px)' : 'none',
                }}
              >
                {step.label}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.8125rem',
                  color: 'secondary.light',
                  lineHeight: 1.4,
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.01em',
                  transition: 'all 0.3s ease',
                }}
              >
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default ProgressIndicator;
