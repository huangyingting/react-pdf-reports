/**
 * Analytics utility for tracking user interactions
 * Supports Google Analytics 4 (GA4)
 */

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event
 * @param eventName - Name of the event (e.g., "Generate Data", "Export PDF")
 * @param properties - Additional properties to track
 */
export const trackEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Convert event name to GA4 format (lowercase with underscores)
    const ga4EventName = eventName.toLowerCase().replace(/\s+/g, '_');
    window.gtag('event', ga4EventName, properties);
  } else {
    console.log('Analytics:', eventName, properties);
  }
};

/**
 * Track page views
 * @param pageName - Optional page name or path
 * @param pageTitle - Optional page title
 */
export const trackPageView = (pageName?: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: pageName,
      page_title: pageTitle,
    });
  }
};

/**
 * Common events to track in the application
 */
export const AnalyticsEvents = {
  // Data generation events
  GENERATE_DATA_STARTED: 'Generate Data Started',
  GENERATE_DATA_COMPLETED: 'Generate Data Completed',
  GENERATE_DATA_FAILED: 'Generate Data Failed',
  
  // Data editing events
  EDIT_DATA: 'Edit Data',
  
  // Export events
  EXPORT_PDF_STARTED: 'Export PDF Started',
  EXPORT_PDF_COMPLETED: 'Export PDF Completed',
  EXPORT_PDF_FAILED: 'Export PDF Failed',
  
  // Report type selection
  REPORT_TYPE_CHANGED: 'Report Type Changed',
  
  // Configuration events
  AZURE_CONFIG_OPENED: 'Azure Config Opened',
  AZURE_CONFIG_SAVED: 'Azure Config Saved',
  
  // Export settings
  EXPORT_FORMAT_CHANGED: 'Export Format Changed',
  QUALITY_LEVEL_CHANGED: 'Quality Level Changed',
  FONT_CHANGED: 'Font Changed',
  WATERMARK_TOGGLED: 'Watermark Toggled',
  
  // Step navigation
  STEP_COMPLETED: 'Step Completed',
} as const;

/**
 * Track report generation with details
 */
export const trackReportGeneration = (
  reportType: string,
  complexity: string,
  options: Record<string, any>
) => {
  trackEvent(AnalyticsEvents.GENERATE_DATA_COMPLETED, {
    reportType,
    complexity,
    ...options,
  });
};

/**
 * Track export with details
 */
export const trackExport = (
  reportType: string,
  format: string,
  quality: string,
  withWatermark: boolean
) => {
  trackEvent(AnalyticsEvents.EXPORT_PDF_COMPLETED, {
    reportType,
    format,
    quality,
    watermark: withWatermark,
  });
};
