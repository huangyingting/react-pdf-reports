import React from 'react';
import { Box, Typography, FormControlLabel, Checkbox, Button, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import DocumentCard from './DocumentCard';
import { StepContainer, ContentContainer, SectionCard, CategoryHeader, DocumentGrid } from './SharedComponents';
import * as styles from '../styles/commonStyles';
import { GeneratedData, LabTestType } from '../utils/zodSchemas';

type ExportFormat = 'pdf' | 'canvas';
type QualityLevel = 'poor' | 'standard' | 'high';
type ReportType = 'medical' | 'cms1500' | 'insurancePolicy' | 'visitReport' | 'medicationHistory' | LabTestType;

interface FontFamily {
  value: string;
  label: string;
  css: string;
}

interface ExportPdfStepProps {
  generatedData: GeneratedData | null;
  exportFormat: ExportFormat;
  setExportFormat: (format: ExportFormat) => void;
  qualityLevel: QualityLevel;
  setQualityLevel: (level: QualityLevel) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  fontFamilies: FontFamily[];
  enableWatermark: boolean;
  setEnableWatermark: (enabled: boolean) => void;
  onPreview: (reportType: ReportType) => void;
  onExport: (reportType: ReportType, filename: string) => void;
  onBack: () => void;
  isLoading: boolean;
}

const ExportPdfStep: React.FC<ExportPdfStepProps> = ({
  generatedData,
  exportFormat,
  setExportFormat,
  qualityLevel,
  setQualityLevel,
  fontFamily,
  setFontFamily,
  fontFamilies,
  enableWatermark,
  setEnableWatermark,
  onPreview,
  onExport,
  onBack,
  isLoading
}) => {
  if (!generatedData) {
    return (
      <StepContainer>
        <Box sx={styles.emptyStateContainer}>
          <Typography variant="h2" gutterBottom>No Data Available</Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Please go back and generate medical data first.
          </Typography>
          <Button variant="contained" color="primary" onClick={onBack}>
            ← Go Back to Generate Data
          </Button>
        </Box>
      </StepContainer>
    );
  }

  // Get the list of generated lab report types
  const generatedLabTypes = new Set(
    generatedData.labReports?.map(report => report.testType) || []
  );

  // Define all available lab tests with their metadata
  const allLabTests: Array<{
    type: LabTestType;
    title: string;
    description: string;
    filename: string;
  }> = [
      { type: 'CBC', title: 'CBC', description: 'Complete blood cell analysis with differential count', filename: 'cbc-report' },
      { type: 'BMP', title: 'BMP', description: 'Basic metabolic panel with glucose and electrolytes', filename: 'bmp-report' },
      { type: 'CMP', title: 'CMP', description: 'Comprehensive metabolic panel with liver function', filename: 'cmp-report' },
      { type: 'Urinalysis', title: 'Urinalysis', description: 'Complete urine analysis with microscopic exam', filename: 'urinalysis-report' },
      { type: 'Lipid', title: 'Lipid Profile', description: 'Cardiovascular risk assessment panel', filename: 'lipid-profile-report' },
      { type: 'LFT', title: 'Liver Function', description: 'Comprehensive liver health assessment', filename: 'lft-report' },
      { type: 'Thyroid', title: 'Thyroid Panel', description: 'Complete thyroid function assessment', filename: 'thyroid-function-report' },
      { type: 'HbA1c', title: 'HbA1c', description: 'Diabetes monitoring and glucose control', filename: 'hba1c-report' },
      { type: 'Coagulation', title: 'Coagulation', description: 'Blood clotting function panel', filename: 'coagulation-panel-report' },
      { type: 'Microbiology', title: 'Microbiology', description: 'Culture and sensitivity testing', filename: 'microbiology-culture-report' },
      { type: 'Pathology', title: 'Pathology', description: 'Tissue specimen analysis report', filename: 'pathology-report' },
      { type: 'Hormone', title: 'Hormone Panel', description: 'Endocrine function testing', filename: 'hormone-panel-report' },
      { type: 'Infectious', title: 'Infectious Disease', description: 'Serological testing panel', filename: 'infectious-disease-panel-report' }
    ];

  // Filter to only show generated lab tests
  const availableLabTests = allLabTests.filter(test => generatedLabTypes.has(test.type));

  // Generate filename suffix based on export format and quality level
  const getFilenameSuffix = (): string => {
    if (exportFormat === 'pdf') {
      return '-v';
    } else {
      // canvas format
      const qualityMap = {
        'poor': 'p',
        'standard': 's',
        'high': 'h'
      };
      return `-c${qualityMap[qualityLevel]}`;
    }
  };

  return (
    <StepContainer>
      <ContentContainer>
        <SectionCard title="Export Settings">
          <Typography variant="body1" color="text.secondary" paragraph>
            Configure how all reports will be generated
          </Typography>

          <Box sx={styles.flexWrapResponsive}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">Export Format</Typography>
              <Select
                value={exportFormat === 'canvas' ? `canvas-${qualityLevel}` : exportFormat}
                onChange={(e: SelectChangeEvent) => {
                  const val = e.target.value;
                  if (val.startsWith('canvas-')) {
                    setExportFormat('canvas');
                    setQualityLevel(val.replace('canvas-', '') as QualityLevel);
                  } else {
                    setExportFormat(val as ExportFormat);
                  }
                }}
                fullWidth
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  }
                }}
              >
                <MenuItem value="pdf">Vector PDF (Selectable Text)</MenuItem>
                <MenuItem value="canvas-poor">Canvas Poor Quality (Fast, Small File)</MenuItem>
                <MenuItem value="canvas-standard">Canvas Standard Quality (Balanced)</MenuItem>
                <MenuItem value="canvas-high">Canvas High Quality (Best, Large File)</MenuItem>
              </Select>
              <Typography variant="caption" color="text.secondary">
                {exportFormat === 'pdf' && 'Vector-based PDF with selectable text and smaller file size'}
                {exportFormat === 'canvas' && qualityLevel === 'poor' && 'Scale: 1x, Quality: 50% - Fastest generation, smallest file'}
                {exportFormat === 'canvas' && qualityLevel === 'standard' && 'Scale: 2x, Quality: 85% - Good balance of quality and size'}
                {exportFormat === 'canvas' && qualityLevel === 'high' && 'Scale: 4x, Quality: 95% - Best quality, largest file size'}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">Font Family</Typography>
              <Select
                value={fontFamily}
                onChange={(e: SelectChangeEvent) => setFontFamily(e.target.value)}
                fullWidth
                sx={{
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                  }
                }}
              >
                {fontFamilies.map(font => (
                  <MenuItem key={font.value} value={font.value}>
                    {font.label}
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary">
                Choose font family for all document text
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary">Watermark</Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={enableWatermark}
                    onChange={(e) => setEnableWatermark(e.target.checked)}
                  />
                }
                label="Enabled"
                sx={{
                  border: '1.5px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  m: 0,
                  bgcolor: enableWatermark ? 'rgba(241, 248, 233, 0.3)' : 'transparent',
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {enableWatermark ? 'Adds repeating "Educational Use Only" watermarks to every page' : 'No watermark will be added'}
              </Typography>
            </Box>
          </Box>
        </SectionCard>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Insurance Forms */}
          <Box>
            <CategoryHeader 
              title="Insurance Forms" 
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />

            <DocumentGrid columns="two">
              <DocumentCard
                title="CMS-1500 Health Insurance Claim Form"
                description="Standard health insurance claim form (HCFA-1500) with patient information, diagnosis codes, and service line items"
                onPreview={() => onPreview('cms1500')}
                onGenerate={() => onExport('cms1500', `${generatedData?.patient?.id || 'patient'}-CMS1500${getFilenameSuffix()}`.toUpperCase())}
                isLoading={isLoading}
                iconType="insurance"
              />

              <DocumentCard
                title="Insurance Policy Certificate"
                description="Professional insurance policy certificate document with coverage details, subscriber information, and benefits summary"
                onPreview={() => onPreview('insurancePolicy')}
                onGenerate={() => onExport('insurancePolicy', `${generatedData?.patient?.id || 'patient'}-POLICY-CERTIFICATE${getFilenameSuffix()}`.toUpperCase())}
                isLoading={isLoading}
                iconType="insurance"
              />
            </DocumentGrid>
          </Box>

          {/* Clinical Reports */}
          <Box>
            <CategoryHeader 
              title="Clinical Reports" 
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            />

            <DocumentGrid columns="three">
              <DocumentCard
                title="Complete Medical Records Report"
                description="Comprehensive medical records including patient demographics, medical history, medications, lab results, and visit notes"
                onPreview={() => onPreview('medical')}
                onGenerate={() => onExport('medical', `${generatedData?.patient?.id || 'patient'}-MEDICAL-RECORDS${getFilenameSuffix()}`.toUpperCase())}
                isLoading={isLoading}
                iconType="medical"
              />

              <DocumentCard
                title="Visit Report"
                description="Clinical visit summary with vital signs, chief complaint, assessment, and treatment plan - optimized for printed clinical records"
                onPreview={() => onPreview('visitReport')}
                onGenerate={() => onExport('visitReport', `${generatedData?.patient?.id || 'patient'}-VISIT-REPORT${getFilenameSuffix()}`.toUpperCase())}
                isLoading={isLoading}
                iconType="visit"
              />

              <DocumentCard
                title="Medication History"
                description="Comprehensive medication history report with current medications, discontinued medications, and allergy information"
                onPreview={() => onPreview('medicationHistory')}
                onGenerate={() => onExport('medicationHistory', `${generatedData?.patient?.id || 'patient'}-MEDICATION-HISTORY${getFilenameSuffix()}`.toUpperCase())}
                isLoading={isLoading}
                iconType="medication"
              />
            </DocumentGrid>
          </Box>

          {/* Laboratory Reports */}
          {availableLabTests.length > 0 && (
            <Box>
              <CategoryHeader 
                title="Laboratory Reports" 
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 2v1m6-1v1M4 8h16M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
                    <path d="M9 11h.01M9 14h.01M12 11h.01M12 14h.01M15 11h.01M15 14h.01" />
                  </svg>
                }
              />

              <Box sx={styles.responsiveGrid}>
                {availableLabTests.map((test) => (
                  <DocumentCard
                    key={test.type}
                    title={test.title}
                    description={test.description}
                    onPreview={() => onPreview(test.type)}
                    onGenerate={() => onExport(test.type, `${generatedData?.patient?.id || 'patient'}_${test.filename}${getFilenameSuffix()}`.toUpperCase())}
                    isLoading={isLoading}
                    compact
                    iconType="lab"
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={styles.sectionDivider} />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{ minWidth: 140 }}
          >
            ← Back to Edit
          </Button>
        </Box>
      </ContentContainer>
    </StepContainer>
  );
};

export default ExportPdfStep;
