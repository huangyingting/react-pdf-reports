import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Button, TextField, Select, MenuItem, FormControl, InputLabel, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { GeneratedData, Patient, InsuranceInfo, Provider, MedicalHistory, VisitReport, LabReport, LabTestType, ChronicCondition, DiscontinuedMedication, SurgicalHistory, FamilyHistory } from '../utils/zodSchemas';
import { MEDICAL_SPECIALTIES } from '../utils/dataGenerator';
import { StepContainer, SectionTitle, FormGrid, TabContent, LoadingSpinner, FloatingActionBar, SubTitle } from './SharedComponents';

interface EditDataStepProps {
  generatedData: GeneratedData | null;
  onDataUpdated: (data: GeneratedData) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Section {
  id: string;
  label: string;
  icon: string;
}

interface PatientInfoSectionProps {
  data: Patient;
  onChange: (field: string, value: any) => void;
}

interface InsuranceSectionProps {
  data: InsuranceInfo;
  onChange: (field: string, value: any) => void;
}

interface ProviderSectionProps {
  data: Provider;
  onChange: (field: string, value: any) => void;
}

interface MedicalHistorySectionProps {
  data: MedicalHistory;
  onChange: (field: string, value: any) => void;
  expandedSections: Set<string>;
  onToggleSection: (section: string) => void;
}

interface LabResultsSectionProps {
  data: LabReport;
  onChange: (updatedData: LabReport) => void;
}

interface VitalSignsSectionProps {
  data: VisitReport;
  onChange: (updatedData: VisitReport) => void;
}

interface VisitNotesSectionProps {
  data: VisitReport;
  onChange: (updatedData: VisitReport) => void;
}

const EditDataStep: React.FC<EditDataStepProps> = ({ generatedData, onDataUpdated, onNext, onBack }) => {
  const [editedData, setEditedData] = useState<GeneratedData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('patient');
  const [expandedLabReports, setExpandedLabReports] = useState<Set<LabTestType>>(new Set());
  const [expandedVisitReports, setExpandedVisitReports] = useState<Set<number>>(new Set());
  const [expandedMedicalSections, setExpandedMedicalSections] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  useEffect(() => {
    if (generatedData) {
      setEditedData(JSON.parse(JSON.stringify(generatedData))); // Deep clone
    }
  }, [generatedData]);

  const updateData = (section: string, field: string, value: any) => {
    setEditedData(prev => {
      if (!prev) return prev;
      const updated = JSON.parse(JSON.stringify(prev)); // Deep clone
      const keys = field.split('.');
      let current: any = (updated as any)[section];
      
      // Navigate to the parent of the field to update
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {}; // Create missing objects
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return updated;
    });
    setHasChanges(true);
  };

  const handleNext = () => {
    if (editedData) {
      onDataUpdated(editedData);
      onNext();
    }
  };

  const handleSaveChanges = () => {
    if (editedData) {
      onDataUpdated(editedData);
      setHasChanges(false);
    }
  };

  if (!editedData) {
    return <LoadingSpinner />;
  }

  const sections: Section[] = [
    { id: 'patient', label: 'Patient', icon: 'user' },
    { id: 'insurance', label: 'Insurance', icon: 'card' },
    { id: 'provider', label: 'Provider', icon: 'stethoscope' },
    { id: 'medical', label: 'Medical History', icon: 'activity' },
    { id: 'labs', label: 'Lab Reports', icon: 'flask' },
    { id: 'vitals', label: 'Vital Signs', icon: 'heart' },
    { id: 'visits', label: 'Visit Notes', icon: 'clipboard' }
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      case 'card':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        );
      case 'stethoscope':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/>
            <circle cx="20" cy="10" r="2"/>
          </svg>
        );
      case 'activity':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        );
      case 'flask':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
            <path d="M8.5 2h7"/>
            <path d="M7 16h10"/>
          </svg>
        );
      case 'heart':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
          </svg>
        );
      case 'clipboard':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          </svg>
        );
      default:
        return <></>;
    }
  };

  return (
    <StepContainer>
      <Box sx={{ borderRadius: 2, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, rgba(250, 248, 243, 1) 0%, rgba(245, 241, 232, 0.95) 100%)',
          m: 0,
          p: 0,
        }}>
          <Tabs
            value={activeSection}
            onChange={(_, newValue) => setActiveSection(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            centered
            sx={{
              minHeight: 56,
              maxWidth: 1200,
              m: 0,
              p: 0,
              '& .MuiTab-root': {
                minHeight: 56,
                textTransform: 'none',
                fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                fontWeight: 600,
                minWidth: { xs: 100, sm: 120, md: 140 },
                color: 'text.secondary',
                transition: 'all 0.2s ease',
                borderRadius: '8px 8px 0 0',
                mx: 0,
                py: 1.25,
                px: { xs: 1.5, sm: 2, md: 2.5 },
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(107, 142, 35, 0.08)',
                  transform: 'translateY(-2px)',
                },
                '&.Mui-selected': {
                  color: 'primary.main',
                  bgcolor: 'rgba(241, 248, 233, 0.9)',
                  fontWeight: 700,
                  boxShadow: '0 -2px 8px rgba(107, 142, 35, 0.12)',
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #6b8e23, #8faf3c)',
                boxShadow: '0 2px 4px rgba(107, 142, 35, 0.3)',
              },
              '& .MuiSvgIcon-root': {
                fontSize: '1.125rem',
              },
              '& .MuiTabs-scrollButtons': {
                color: 'primary.main',
                '&.Mui-disabled': {
                  opacity: 0.3,
                }
              }
            }}
          >
            {sections.map(section => (
              <Tab
                key={section.id}
                value={section.id}
                label={section.label}
                icon={getIcon(section.icon)}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        <TabContent key={activeSection}>
            {activeSection === 'patient' && (
              <PatientInfoSection 
                data={editedData.patient} 
                onChange={(field, value) => updateData('patient', field, value)}
              />
            )}
            
            {activeSection === 'insurance' && (
              <InsuranceSection 
                data={editedData.insuranceInfo} 
                onChange={(field, value) => updateData('insuranceInfo', field, value)}
              />
            )}
            
            {activeSection === 'provider' && (
              <ProviderSection 
                data={editedData.provider} 
                onChange={(field, value) => updateData('provider', field, value)}
              />
            )}
            
            {activeSection === 'medical' && editedData.medicalHistory && (
              <MedicalHistorySection 
                data={editedData.medicalHistory}
                expandedSections={expandedMedicalSections}
                onToggleSection={(section) => {
                  const newExpanded = new Set(expandedMedicalSections);
                  if (newExpanded.has(section)) {
                    newExpanded.delete(section);
                  } else {
                    newExpanded.add(section);
                  }
                  setExpandedMedicalSections(newExpanded);
                }}
                onChange={(field, value) => {
                  setEditedData(prev => {
                    if (!prev) return prev;
                    const updated = JSON.parse(JSON.stringify(prev));
                    const keys = field.split('.');
                    let current: any = updated.medicalHistory;
                    
                    for (let i = 0; i < keys.length - 1; i++) {
                      current = current[keys[i]];
                    }
                    current[keys[keys.length - 1]] = value;
                    setHasChanges(true);
                    return updated;
                  });
                }}
              />
            )}
            
            {/* Lab Results section: Data now managed via LabReport[] */}
            {activeSection === 'labs' && (
              <>
                {editedData.labReports.length > 0 ? (
                  <Box>
                    <SectionTitle>Laboratory Reports ({editedData.labReports.length} reports)</SectionTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {editedData.labReports.map((labData, index) => {
                        const isExpanded = expandedLabReports.has(labData.testType as LabTestType);
                        return (
                          <Accordion 
                            key={labData.testType}
                            expanded={isExpanded}
                            onChange={() => {
                              const newExpanded = new Set(expandedLabReports);
                              if (isExpanded) {
                                newExpanded.delete(labData.testType as LabTestType);
                              } else {
                                newExpanded.add(labData.testType as LabTestType);
                              }
                              setExpandedLabReports(newExpanded);
                            }}
                            sx={{ mb: 1.5 }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                {labData.testName} ({labData.testType}) <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>- {labData.results.length} results</Typography>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <LabResultsSection
                                data={labData}
                                onChange={(updated) => {
                                  setEditedData(prev => {
                                    if (!prev) return prev;
                                    const newData = JSON.parse(JSON.stringify(prev));
                                    newData.labReports[index] = updated;
                                    setHasChanges(true);
                                    return newData;
                                  });
                                }}
                              />
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2.5, color: 'primary.main', fontWeight: 600, fontSize: '1.25rem' }}>
                      Laboratory Report
                    </Typography>
                    <Typography variant="body1" color="warning.main">
                      ⚠️ No laboratory report data available. Please generate data first.
                    </Typography>
                  </Box>
                )}
              </>
            )}
            
            {/* Vital Signs section: Data now managed via VisitReport[] */}
            {activeSection === 'vitals' && (
              <>
                {editedData.visitReports.length > 0 ? (
                  <Box>
                    <SectionTitle >
                      Vital Signs ({editedData.visitReports.length} visits)
                    </SectionTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {editedData.visitReports.map((visitData, index) => {
                        const isExpanded = expandedVisitReports.has(index);
                        return (
                          <Accordion 
                            key={index}
                            expanded={isExpanded}
                            onChange={() => {
                              const newExpanded = new Set(expandedVisitReports);
                              if (isExpanded) {
                                newExpanded.delete(index);
                              } else {
                                newExpanded.add(index);
                              }
                              setExpandedVisitReports(newExpanded);
                            }}
                            sx={{ mb: 1.5 }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                Visit {index + 1} - {visitData.visit.date} <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>- {visitData.visit.type}</Typography>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <VitalSignsSection
                                data={visitData}
                                onChange={(updated) => {
                                  setEditedData(prev => {
                                    if (!prev) return prev;
                                    const newData = JSON.parse(JSON.stringify(prev));
                                    newData.visitReports[index] = updated;
                                    setHasChanges(true);
                                    return newData;
                                  });
                                }}
                              />
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <SubTitle>
                      Vital Signs
                    </SubTitle>
                    <SubTitle variant="body1" color="warning.main">
                      ⚠️ No visit report data available. Please generate data first.
                    </SubTitle>
                  </Box>
                )}
              </>
            )}
            
            {/* Visit Notes section: Data now managed via VisitReport[] */}
            {activeSection === 'visits' && (
              <>
                {editedData.visitReports.length > 0 ? (
                  <Box>
                    <SectionTitle>
                      Visit Notes ({editedData.visitReports.length} visits)
                    </SectionTitle>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {editedData.visitReports.map((visitData, index) => {
                        const isExpanded = expandedVisitReports.has(index);
                        return (
                          <Accordion 
                            key={index}
                            expanded={isExpanded}
                            onChange={() => {
                              const newExpanded = new Set(expandedVisitReports);
                              if (isExpanded) {
                                newExpanded.delete(index);
                              } else {
                                newExpanded.add(index);
                              }
                              setExpandedVisitReports(newExpanded);
                            }}
                            sx={{ mb: 1.5 }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                                Visit {index + 1} - {visitData.visit.date} <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>- {visitData.visit.type}</Typography>
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <VisitNotesSection
                                data={visitData}
                                onChange={(updated) => {
                                  setEditedData(prev => {
                                    if (!prev) return prev;
                                    const newData = JSON.parse(JSON.stringify(prev));
                                    newData.visitReports[index] = updated;
                                    setHasChanges(true);
                                    return newData;
                                  });
                                }}
                              />
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ mb: 2.5, color: 'primary.main', fontWeight: 600, fontSize: '1.25rem' }}>
                      Visit Notes
                    </Typography>
                    <Typography variant="body1" color="warning.main">
                      ⚠️ No visit report data available. Please generate data first.
                    </Typography>
                  </Box>
                )}
              </>
            )}
        </TabContent>

        <FloatingActionBar variant="spaced">
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ 
              minWidth: 140,
              px: 3,
              py: 1.25,
              fontSize: '0.9375rem',
              borderRadius: 2.5,
              borderWidth: 2,
              textTransform: 'none',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderWidth: 2,
                transform: 'translateX(-4px)',
                boxShadow: '0 4px 12px rgba(107, 142, 35, 0.15)',
              }
            }}
          >
            ← Back to Generate
          </Button>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            {hasChanges && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveChanges}
                sx={{
                  px: 3,
                  py: 1.25,
                  fontSize: '0.9375rem',
                  borderRadius: 2.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(109, 76, 65, 0.3)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(109, 76, 65, 0.4)',
                  }
                }}
              >
                Save Changes
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{ 
                minWidth: 140,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 2.5,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(107, 142, 35, 0.3)',
                background: 'linear-gradient(135deg, #6b8e23 0%, #8faf3c 100%)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(107, 142, 35, 0.4)',
                }
              }}
            >
              Continue to Export →
            </Button>
          </Box>
        </FloatingActionBar>
      </Box>
    </StepContainer>
  );
};

// Patient Info Section Component
const PatientInfoSection: React.FC<PatientInfoSectionProps> = ({ data, onChange }) => (
  <Box>
    <SectionTitle>Patient Demographics</SectionTitle>
    
    <FormGrid>
      <TextField
        label="First Name"
        value={data.firstName}
        onChange={(e) => onChange('firstName', e.target.value)}
        fullWidth
        size="small"
      />

      <TextField
        label="Middle Initial"
        value={data.middleInitial || ''}
        onChange={(e) => onChange('middleInitial', e.target.value)}
        fullWidth
        size="small"
        inputProps={{ maxLength: 1 }}
      />

      <TextField
        label="Last Name"
        value={data.lastName}
        onChange={(e) => onChange('lastName', e.target.value)}
        fullWidth
        size="small"
      />
            
      <TextField
        label="Date of Birth"
        value={data.dateOfBirth}
        onChange={(e) => onChange('dateOfBirth', e.target.value)}
        placeholder="MM/DD/YYYY"
        fullWidth
        size="small"
      />
            
      <TextField
        label="Medical Record Number"
        value={data.medicalRecordNumber}
        onChange={(e) => onChange('medicalRecordNumber', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="SSN"
        value={data.ssn}
        onChange={(e) => onChange('ssn', e.target.value)}
        placeholder="XXX-XX-XXXX"
        fullWidth
        size="small"
      />
      
      <TextField
        label="Account Number"
        value={data.accountNumber || ''}
        onChange={(e) => onChange('accountNumber', e.target.value)}
        placeholder="Optional"
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Gender</InputLabel>
        <Select
          value={data.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          label="Gender"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Phone Number"
        value={data.contact.phone}
        onChange={(e) => onChange('contact.phone', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Email"
        type="email"
        value={data.contact.email}
        onChange={(e) => onChange('contact.email', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Emergency Contact"
        value={data.contact.emergencyContact}
        onChange={(e) => onChange('contact.emergencyContact', e.target.value)}
        placeholder="Name and phone number"
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />

      <TextField
        label="Street Address"
        value={data.address.street}
        onChange={(e) => onChange('address.street', e.target.value)}
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="City"
        value={data.address.city}
        onChange={(e) => onChange('address.city', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="State"
        value={data.address.state}
        onChange={(e) => onChange('address.state', e.target.value)}
        inputProps={{ maxLength: 2 }}
        fullWidth
        size="small"
      />
      
      <TextField
        label="ZIP Code"
        value={data.address.zipCode}
        onChange={(e) => onChange('address.zipCode', e.target.value)}
        fullWidth
        size="small"
      />
    </FormGrid>
  </Box>
);

// Insurance Section Component
const InsuranceSection: React.FC<InsuranceSectionProps> = ({ data, onChange }) => {
  const handleAddSecondaryInsurance = () => {
    // TODO: Implement secondary insurance generation
    // Generate secondary insurance with populated data, excluding the primary insurance provider
    // const result = generateSecondaryInsuranceAndInsured(data.primaryInsurance.provider);
    // onChange('secondaryInsurance', result?.secondaryInsurance);
    // if (result?.secondaryInsured) {
    //   onChange('secondaryInsured', result?.secondaryInsured);
    // }
    console.warn('Secondary insurance generation not yet implemented');
  };

  const handleRemoveSecondaryInsurance = () => {
    onChange('secondaryInsurance', null);
  };

  return (
    <Box>
      <SectionTitle>Insurance Information</SectionTitle>

      <SubTitle>
        Subscriber Information
      </SubTitle>
      <FormGrid sx={{ mb: 3 }}>
        <TextField
          label="Subscriber Name"
          value={data.subscriberName || ''}
          onChange={(e) => onChange('subscriberName', e.target.value)}
          placeholder="If different from patient"
          fullWidth
          size="small"
        />
        
        <TextField
          label="Subscriber DOB"
          value={data.subscriberDOB || ''}
          onChange={(e) => onChange('subscriberDOB', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
          size="small"
        />
        
        <FormControl fullWidth size="small">
          <InputLabel>Subscriber Gender</InputLabel>
          <Select
            value={data.subscriberGender || ''}
            onChange={(e) => onChange('subscriberGender', e.target.value)}
            label="Subscriber Gender"
          >
            <MenuItem value="">Select...</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </FormGrid>

      <SubTitle sx={{ mt: 2.5 }}>
        Primary Insurance
      </SubTitle>
      
      <FormGrid sx={{ mb: 3 }}>
        <TextField
          label="Insurance Company"
          value={data.primaryInsurance.provider}
          onChange={(e) => onChange('primaryInsurance.provider', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Policy Number"
          value={data.primaryInsurance.policyNumber}
          onChange={(e) => onChange('primaryInsurance.policyNumber', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Group Number"
          value={data.primaryInsurance.groupNumber ?? ''}
          onChange={(e) => onChange('primaryInsurance.groupNumber', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Member ID"
          value={data.primaryInsurance.memberId ?? ''}
          onChange={(e) => onChange('primaryInsurance.memberId', e.target.value)}
          fullWidth
          size="small"
        />
        
        <TextField
          label="Copay"
          value={data.primaryInsurance.copay || ''}
          onChange={(e) => onChange('primaryInsurance.copay', e.target.value)}
          placeholder="$20"
          fullWidth
          size="small"
        />
        
        <TextField
          label="Deductible"
          value={data.primaryInsurance.deductible || ''}
          onChange={(e) => onChange('primaryInsurance.deductible', e.target.value)}
          placeholder="$1000"
          fullWidth
          size="small"
        />
      </FormGrid>

      <Box sx={{ mt: 2.5, mb: 2.5 }}>
        <Button 
          variant={data.secondaryInsurance ? "outlined" : "contained"}
          color="secondary"
          onClick={data.secondaryInsurance ? handleRemoveSecondaryInsurance : handleAddSecondaryInsurance}
          startIcon={data.secondaryInsurance ? <DeleteIcon /> : <AddIcon />}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
          }}
        >
          {data.secondaryInsurance ? 'Remove Secondary Insurance' : 'Add Secondary Insurance'}
        </Button>
      </Box>

      {data.secondaryInsurance && (
        <Box>
          <SubTitle>
            Secondary Insurance
          </SubTitle>
          <FormGrid>
            <TextField
              label="Insurance Company"
              value={data.secondaryInsurance.provider}
              onChange={(e) => onChange('secondaryInsurance.provider', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Policy Number"
              value={data.secondaryInsurance.policyNumber}
              onChange={(e) => onChange('secondaryInsurance.policyNumber', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Group Number"
              value={data.secondaryInsurance.groupNumber || ''}
              onChange={(e) => onChange('secondaryInsurance.groupNumber', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Member ID"
              value={data.secondaryInsurance.memberId || ''}
              onChange={(e) => onChange('secondaryInsurance.memberId', e.target.value)}
              fullWidth
              size="small"
            />
            
            <TextField
              label="Effective Date"
              value={data.secondaryInsurance.effectiveDate || ''}
              onChange={(e) => onChange('secondaryInsurance.effectiveDate', e.target.value)}
              placeholder="YYYY-MM-DD"
              fullWidth
              size="small"
            />
            
            <TextField
              label="Copay"
              value={data.secondaryInsurance.copay || ''}
              onChange={(e) => onChange('secondaryInsurance.copay', e.target.value)}
              placeholder="$20"
              fullWidth
              size="small"
            />
            
            <TextField
              label="Deductible"
              value={data.secondaryInsurance.deductible || ''}
              onChange={(e) => onChange('secondaryInsurance.deductible', e.target.value)}
              placeholder="$1000"
              fullWidth
              size="small"
            />
          </FormGrid>
        </Box>
      )}
    </Box>
  );
};

// Provider Section Component
const ProviderSection: React.FC<ProviderSectionProps> = ({ data, onChange }) => (
  <Box>
    <SectionTitle>Primary Care Provider</SectionTitle>
    
    <FormGrid sx={{ mb: 3 }}>
      <TextField
        label="Provider Name"
        value={data.name}
        onChange={(e) => onChange('name', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="NPI Number"
        value={data.npi}
        onChange={(e) => onChange('npi', e.target.value)}
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Specialty</InputLabel>
        <Select
          value={data.specialty}
          onChange={(e) => onChange('specialty', e.target.value)}
          label="Specialty"
        >
          {MEDICAL_SPECIALTIES.map(specialty => (
            <MenuItem key={specialty} value={specialty}>
              {specialty}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        label="Phone"
        value={data.phone}
        onChange={(e) => onChange('phone', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Tax ID"
        value={data.taxId || ''}
        onChange={(e) => onChange('taxId', e.target.value)}
        placeholder="Optional"
        fullWidth
        size="small"
      />
      
      <FormControl fullWidth size="small">
        <InputLabel>Tax ID Type</InputLabel>
        <Select
          value={data.taxIdType || ''}
          onChange={(e) => onChange('taxIdType', e.target.value as 'SSN' | 'EIN')}
          label="Tax ID Type"
        >
          <MenuItem value="">Select...</MenuItem>
          <MenuItem value="SSN">SSN</MenuItem>
          <MenuItem value="EIN">EIN</MenuItem>
        </Select>
      </FormControl>
    </FormGrid>


    <FormGrid sx={{ mb: 3 }}>
      <TextField
        label="Facility Name"
        value={data.facilityName || ''}
        onChange={(e) => onChange('facilityName', e.target.value)}
        fullWidth
        size="small"
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="Facility Phone"
        value={data.facilityPhone || ''}
        onChange={(e) => onChange('facilityPhone', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Facility Fax"
        value={data.facilityFax || ''}
        onChange={(e) => onChange('facilityFax', e.target.value)}
        fullWidth
        size="small"
      />
      
      <TextField
        label="Facility NPI"
        value={data.facilityNPI || ''}
        onChange={(e) => onChange('facilityNPI', e.target.value)}
        fullWidth
        size="small"
      />
      <TextField
        label="Street Address"
        value={data.address.street}
        onChange={(e) => onChange('address.street', e.target.value)}
        fullWidth
        sx={{ gridColumn: 'span 2' }}
      />
      
      <TextField
        label="City"
        value={data.address.city}
        onChange={(e) => onChange('address.city', e.target.value)}
        fullWidth
      />
      
      <TextField
        label="State"
        value={data.address.state}
        onChange={(e) => onChange('address.state', e.target.value)}
        inputProps={{ maxLength: 2 }}
        fullWidth
      />
      
      <TextField
        label="ZIP Code"
        value={data.address.zipCode}
        onChange={(e) => onChange('address.zipCode', e.target.value)}
        fullWidth
      />
    </FormGrid>
  </Box>
);

// Medical History Section Component
const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({ data, onChange, expandedSections, onToggleSection }) => (
  <Box>
    <SectionTitle>Medical History</SectionTitle>
    
    {/* Allergies Accordion */}
    <Accordion 
      expanded={expandedSections.has('allergies')}
      onChange={() => onToggleSection('allergies')}
      sx={{ mb: 1.5 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Allergies <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>({(data.allergies || []).length} items)</Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(data.allergies || []).map((allergy, index) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.allergies || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Allergen"
                value={allergy.allergen}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].allergen = e.target.value;
                  onChange('allergies', updated);
                }}
                placeholder="e.g., Penicillin"
                fullWidth
              />
              
              <TextField
                label="Reaction"
                value={allergy.reaction}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].reaction = e.target.value;
                  onChange('allergies', updated);
                }}
                placeholder="e.g., Rash, Hives"
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={allergy.severity}
                  onChange={(e) => {
                    const updated = [...(data.allergies || [])];
                    updated[index].severity = e.target.value;
                    onChange('allergies', updated);
                  }}
                  label="Severity"
                >
                  <MenuItem value="Mild">Mild</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Severe">Severe</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Date Identified"
                value={allergy.dateIdentified}
                onChange={(e) => {
                  const updated = [...(data.allergies || [])];
                  updated[index].dateIdentified = e.target.value;
                  onChange('allergies', updated);
                }}
                placeholder="MM/DD/YYYY or Unknown"
                fullWidth
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Active Conditions Accordion */}
    <Accordion 
      expanded={expandedSections.has('conditions')}
      onChange={() => onToggleSection('conditions')}
      sx={{ mb: 1.5 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Active Conditions <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>({(data.chronicConditions || []).length} items)</Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(data.chronicConditions || []).map((condition: ChronicCondition, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.chronicConditions || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Condition Name"
                value={condition.condition}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].condition = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                placeholder="e.g., Type 2 Diabetes"
                fullWidth
              />
              
              <TextField
                label="Diagnosed Date"
                value={condition.diagnosedDate}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].diagnosedDate = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={condition.status}
                  onChange={(e) => {
                    const updated = [...(data.chronicConditions || [])];
                    updated[index].status = e.target.value;
                    onChange('chronicConditions', updated);
                  }}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Stable">Stable</MenuItem>
                  <MenuItem value="Improving">Improving</MenuItem>
                  <MenuItem value="Monitoring">Monitoring</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Notes"
                value={condition.notes}
                onChange={(e) => {
                  const updated = [...(data.chronicConditions || [])];
                  updated[index].notes = e.target.value;
                  onChange('chronicConditions', updated);
                }}
                placeholder="Additional information..."
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Current Medications Accordion */}
    <Accordion 
      expanded={expandedSections.has('currentMeds')}
      onChange={() => onToggleSection('currentMeds')}
      sx={{ mb: 1.5 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Current Medications <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>({(data.medications.current || []).length} items)</Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(data.medications.current || []).map((med, index) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.medications.current || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Medication Name"
                value={med.name}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].name = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., Lisinopril"
                fullWidth
              />
              
              <TextField
                label="Strength"
                value={med.strength}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].strength = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., 10mg"
                fullWidth
              />
              
              <TextField
                label="Dosage"
                value={med.dosage}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].dosage = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., Once daily"
                fullWidth
              />
              
              <TextField
                label="Purpose"
                value={med.purpose}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].purpose = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="e.g., Blood pressure control"
                fullWidth
              />
              
              <TextField
                label="Prescribed By"
                value={med.prescribedBy}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].prescribedBy = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="Provider name"
                fullWidth
              />
              
              <TextField
                label="Start Date"
                value={med.startDate}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].startDate = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <TextField
                label="Instructions"
                value={med.instructions}
                onChange={(e) => {
                  const updated = [...(data.medications.current || [])];
                  updated[index].instructions = e.target.value;
                  onChange('medications.current', updated);
                }}
                placeholder="Special instructions"
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Discontinued Medications Accordion */}
    <Accordion 
      expanded={expandedSections.has('discontinuedMeds')}
      onChange={() => onToggleSection('discontinuedMeds')}
      sx={{ mb: 1.5 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Discontinued Medications <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>({(data.medications.discontinued || []).length} items)</Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(data.medications.discontinued || []).map((med: DiscontinuedMedication, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.medications.discontinued || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Medication Name"
                value={med.name}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].name = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="e.g., Metformin"
                fullWidth
              />
              
              <TextField
                label="Strength"
                value={med.strength}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].strength = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="e.g., 500mg"
                fullWidth
              />
              
              <TextField
                label="Reason for Discontinuation"
                value={med.reason}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].reason = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="e.g., Side effects"
                fullWidth
              />
              
              <TextField
                label="Discontinued Date"
                value={med.discontinuedDate}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].discontinuedDate = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <TextField
                label="Prescribed By"
                value={med.prescribedBy}
                onChange={(e) => {
                  const updated = [...(data.medications.discontinued || [])];
                  updated[index].prescribedBy = e.target.value;
                  onChange('medications.discontinued', updated);
                }}
                placeholder="Provider name"
                fullWidth
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Surgical History Accordion */}
    <Accordion 
      expanded={expandedSections.has('surgicalHistory')}
      onChange={() => onToggleSection('surgicalHistory')}
      sx={{ mb: 1.5 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Surgical History <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>({(data.surgicalHistory || []).length} items)</Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(data.surgicalHistory || []).map((surgery: SurgicalHistory, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.surgicalHistory || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Procedure"
                value={surgery.procedure}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].procedure = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="e.g., Appendectomy"
                fullWidth
              />
              
              <TextField
                label="Date"
                value={surgery.date}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].date = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="MM/DD/YYYY"
                fullWidth
              />
              
              <TextField
                label="Hospital"
                value={surgery.hospital}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].hospital = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="Hospital name"
                fullWidth
              />
              
              <TextField
                label="Surgeon"
                value={surgery.surgeon}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].surgeon = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="Surgeon name"
                fullWidth
              />
              
              <TextField
                label="Complications"
                value={surgery.complications}
                onChange={(e) => {
                  const updated = [...(data.surgicalHistory || [])];
                  updated[index].complications = e.target.value;
                  onChange('surgicalHistory', updated);
                }}
                placeholder="Any complications or notes..."
                multiline
                rows={2}
                fullWidth
                sx={{ gridColumn: 'span 2' }}
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>

    {/* Family History Accordion */}
    <Accordion 
      expanded={expandedSections.has('familyHistory')}
      onChange={() => onToggleSection('familyHistory')}
      sx={{ mb: 1.5 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>
          Family History <Typography component="span" sx={{ ml: 1, color: 'text.secondary', fontSize: '0.875rem' }}>({(data.familyHistory || []).length} items)</Typography>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {(data.familyHistory || []).map((family: FamilyHistory, index: number) => (
          <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < (data.familyHistory || []).length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
            <FormGrid>
              <TextField
                label="Relation"
                value={family.relation}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].relation = e.target.value;
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., Father, Mother"
                fullWidth
              />
              
              <TextField
                label="Conditions (comma-separated)"
                value={family.conditions.join(', ')}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].conditions = e.target.value.split(',').map(c => c.trim()).filter(c => c);
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., Diabetes, Heart Disease"
                fullWidth
              />
              
              <TextField
                label="Age at Death"
                value={family.ageAtDeath}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].ageAtDeath = e.target.value;
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., 75 or Living"
                fullWidth
              />
              
              <TextField
                label="Cause of Death"
                value={family.causeOfDeath}
                onChange={(e) => {
                  const updated = [...(data.familyHistory || [])];
                  updated[index].causeOfDeath = e.target.value;
                  onChange('familyHistory', updated);
                }}
                placeholder="e.g., Heart Attack or N/A"
                fullWidth
              />
            </FormGrid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  </Box>
);

// Lab Results Section Component - Updated to use LaboratoryReportData
const LabResultsSection: React.FC<LabResultsSectionProps> = ({ data, onChange }) => {
  if (!data) return null;

  const handleFieldChange = (field: string, value: any) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
  };

  const handleResultChange = (resultIndex: number, field: string, value: any) => {
    const updated = { ...data };
    updated.results = [...data.results];
    updated.results[resultIndex] = { ...updated.results[resultIndex], [field]: value };
    onChange(updated);
  };

  return (
    <Box>      
      <SubTitle>Test Information</SubTitle>
      <FormGrid sx={{ mb: 4 }}>
        <TextField
          label="Test Name"
          value={data.testName}
          onChange={(e) => handleFieldChange('testName', e.target.value)}
          fullWidth
        />
        
        <TextField
          label="Specimen Type"
          value={data.specimenType}
          onChange={(e) => handleFieldChange('specimenType', e.target.value)}
          fullWidth
        />
        
        <TextField
          label="Collection Date"
          value={data.specimenCollectionDate}
          onChange={(e) => handleFieldChange('specimenCollectionDate', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
        />
        
        <TextField
          label="Report Date"
          value={data.reportDate}
          onChange={(e) => handleFieldChange('reportDate', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
        />
        
        <TextField
          label="Ordering Physician"
          value={data.orderingPhysician}
          onChange={(e) => handleFieldChange('orderingPhysician', e.target.value)}
          fullWidth
        />
      </FormGrid>

      <SubTitle>Test Results ({data.results.length})</SubTitle>
      {data.results.map((result, index) => (
        <Box key={index} sx={{ mb: 3, pb: 3, borderBottom: index < data.results.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
          <FormGrid>
            <TextField
              label="Parameter"
              value={result.parameter}
              onChange={(e) => handleResultChange(index, 'parameter', e.target.value)}
              placeholder="e.g., WBC"
              fullWidth
            />
            
            <TextField
              label="Value"
              value={result.value}
              onChange={(e) => handleResultChange(index, 'value', e.target.value)}
              placeholder="e.g., 7.5"
              fullWidth
            />
            
            <TextField
              label="Unit"
              value={result.unit}
              onChange={(e) => handleResultChange(index, 'unit', e.target.value)}
              placeholder="e.g., K/uL"
              fullWidth
            />
            
            <TextField
              label="Reference Range"
              value={result.referenceRange}
              onChange={(e) => handleResultChange(index, 'referenceRange', e.target.value)}
              placeholder="e.g., 4.5-11.0"
              fullWidth
            />
            
            <FormControl fullWidth>
              <InputLabel>Flag</InputLabel>
              <Select
                value={result.flag}
                onChange={(e) => handleResultChange(index, 'flag', e.target.value)}
                label="Flag"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Critical">Critical</MenuItem>
                <MenuItem value="Abnormal">Abnormal</MenuItem>
              </Select>
            </FormControl>
          </FormGrid>
        </Box>
      ))}
    </Box>
  );
};

// Vital Signs Section Component - Updated to use VisitReportData
const VitalSignsSection: React.FC<VitalSignsSectionProps> = ({ data, onChange }) => {
  if (!data || !data.vitalSigns) return null;

  const handleVitalChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.vitalSigns = { ...data.vitalSigns, [field]: value };
    onChange(updated);
  };

  const vitals = data.vitalSigns;

  return (
    <Box>
      <SubTitle>Vital Signs</SubTitle>
      <FormGrid>
        <TextField
          label="Blood Pressure"
          value={vitals.bloodPressure}
          onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
          placeholder="120/80"
          fullWidth
        />
        
        <TextField
          label="Heart Rate (bpm)"
          value={vitals.heartRate}
          onChange={(e) => handleVitalChange('heartRate', e.target.value)}
          placeholder="72"
          fullWidth
        />
        
        <TextField
          label="Temperature (°F)"
          value={vitals.temperature}
          onChange={(e) => handleVitalChange('temperature', e.target.value)}
          placeholder="98.6"
          fullWidth
        />
        
        <TextField
          label="Weight (lbs)"
          value={vitals.weight}
          onChange={(e) => handleVitalChange('weight', e.target.value)}
          placeholder="150"
          fullWidth
        />
        
        <TextField
          label="Height"
          value={vitals.height}
          onChange={(e) => handleVitalChange('height', e.target.value)}
          placeholder="5'8&quot;"
          fullWidth
        />
        
        <TextField
          label="BMI"
          value={vitals.bmi}
          onChange={(e) => handleVitalChange('bmi', e.target.value)}
          placeholder="22.8"
          fullWidth
        />
        
        <TextField
          label="Oxygen Saturation (%)"
          value={vitals.oxygenSaturation}
          onChange={(e) => handleVitalChange('oxygenSaturation', e.target.value)}
          placeholder="98"
          fullWidth
        />
        
        <TextField
          label="Respiratory Rate (breaths/min)"
          value={vitals.respiratoryRate}
          onChange={(e) => handleVitalChange('respiratoryRate', e.target.value)}
          placeholder="16"
          fullWidth
        />
      </FormGrid>
    </Box>
  );
};

// Visit Notes Section Component - Updated to use VisitReportData
const VisitNotesSection: React.FC<VisitNotesSectionProps> = ({ data, onChange }) => {
  if (!data || !data.visit) return null;

  const handleVisitChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.visit = { ...data.visit, [field]: value };
    onChange(updated);
  };

  const handleVitalChange = (field: string, value: any) => {
    const updated = { ...data };
    updated.vitalSigns = { ...data.vitalSigns, [field]: value };
    onChange(updated);
  };

  const visit = data.visit;

  return (
    <Box>
      <SubTitle>Visit Notes</SubTitle>
      <FormGrid>
        <TextField
          label="Visit Date"
          value={visit.date}
          onChange={(e) => handleVisitChange('date', e.target.value)}
          placeholder="MM/DD/YYYY"
          fullWidth
        />
        
        <TextField
          label="Visit Type"
          value={visit.type}
          onChange={(e) => handleVisitChange('type', e.target.value)}
          placeholder="e.g., Follow-up, Annual Physical"
          fullWidth
        />
        
        <TextField
          label="Duration"
          value={visit.duration}
          onChange={(e) => handleVisitChange('duration', e.target.value)}
          placeholder="e.g., 30 minutes"
          fullWidth
        />
        
        <TextField
          label="Provider"
          value={visit.provider}
          onChange={(e) => handleVisitChange('provider', e.target.value)}
          placeholder="Provider name"
          fullWidth
        />
        
        <TextField
          label="Chief Complaint"
          value={visit.chiefComplaint}
          onChange={(e) => handleVisitChange('chiefComplaint', e.target.value)}
          placeholder="Patient's main concern..."
          multiline
          rows={2}
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
        
        <TextField
          label="Assessment (comma-separated)"
          value={visit.assessment.join(', ')}
          onChange={(e) => handleVisitChange('assessment', e.target.value.split(',').map(a => a.trim()).filter(a => a))}
          placeholder="Diagnoses and findings..."
          multiline
          rows={2}
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
        
        <TextField
          label="Plan (comma-separated)"
          value={visit.plan.join(', ')}
          onChange={(e) => handleVisitChange('plan', e.target.value.split(',').map(p => p.trim()).filter(p => p))}
          placeholder="Treatment plan and next steps..."
          multiline
          rows={2}
          fullWidth
          sx={{ gridColumn: 'span 2' }}
        />
      </FormGrid>
      
      <SectionTitle sx={{ mt: 4, mb: 2, fontSize: '1.1rem' }}>Vitals</SectionTitle>
      <FormGrid>
        <TextField
          label="Blood Pressure"
          value={data.vitalSigns.bloodPressure}
          onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
          placeholder="120/80"
          fullWidth
        />
        
        <TextField
          label="Heart Rate"
          type="number"
          value={data.vitalSigns.heartRate}
          onChange={(e) => handleVitalChange('heartRate', parseInt(e.target.value) || 0)}
          placeholder="72"
          fullWidth
        />
        
        <TextField
          label="Temperature (°F)"
          type="number"
          value={data.vitalSigns.temperature}
          onChange={(e) => handleVitalChange('temperature', parseFloat(e.target.value) || 0)}
          placeholder="98.6"
          fullWidth
          inputProps={{ step: 0.1 }}
        />
        
        <TextField
          label="Weight (lbs)"
          type="number"
          value={data.vitalSigns.weight}
          onChange={(e) => handleVitalChange('weight', parseInt(e.target.value) || 0)}
          placeholder="150"
          fullWidth
        />
        
        <TextField
          label="Height"
          value={data.vitalSigns.height}
          onChange={(e) => handleVitalChange('height', e.target.value)}
          placeholder="5'8&quot;"
          fullWidth
        />
        
        <TextField
          label="Oxygen Saturation (%)"
          type="number"
          value={data.vitalSigns.oxygenSaturation}
          onChange={(e) => handleVitalChange('oxygenSaturation', parseInt(e.target.value) || 0)}
          placeholder="98"
          fullWidth
        />
      </FormGrid>
    </Box>
  );
};

export default EditDataStep;
