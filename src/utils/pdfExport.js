import jsPDF from 'jspdf';

/**
 * Unified PDF Export Configuration
 * Single source of truth for all PDF generation settings
 */
const PDF_CONFIG = {
  // Page settings
  page: {
    format: 'a4',
    orientation: 'portrait',
    unit: 'mm'
  },
  
  // Margin settings (minimal since medical records have 12mm built-in padding)
  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  
  // Image quality settings
  image: {
    type: 'jpeg',
    quality: 0.98
  },
  
  // HTML2Canvas rendering settings
  html2canvas: {
    useCORS: true,
    letterRendering: true,
    allowTaint: false
  },
  
  // Rendering settings
  rendering: {
    windowWidth: 800, // Optimized for medical records
    width: 200 // A4 width (210mm) minus margins (10mm total)
  }
};

/**
 * Get unified PDF options
 * @param {Object} customOptions - Custom options to override defaults
 * @returns {Object} Merged PDF configuration
 */
const getPDFOptions = (customOptions = {}) => {
  const baseOptions = {
    margin: [PDF_CONFIG.margins.top, PDF_CONFIG.margins.right, PDF_CONFIG.margins.bottom, PDF_CONFIG.margins.left],
    image: PDF_CONFIG.image,
    html2canvas: PDF_CONFIG.html2canvas,
    jsPDF: {
      unit: PDF_CONFIG.page.unit,
      format: PDF_CONFIG.page.format,
      orientation: PDF_CONFIG.page.orientation
    }
  };
  
  return { ...baseOptions, ...customOptions };
};

/**
 * Create jsPDF instance with unified configuration
 * @param {Object} options - PDF options
 * @returns {jsPDF} Configured jsPDF instance
 */
const createPDFInstance = (options) => {
  return new jsPDF(
    options.jsPDF.orientation,
    options.jsPDF.unit,
    options.jsPDF.format
  );
};

/**
 * Get unified HTML rendering options
 * @param {HTMLElement} element - The HTML element to render
 * @param {Object} options - PDF options
 * @param {Function} callback - Callback function
 * @returns {Object} HTML rendering configuration
 */
const getHTMLRenderOptions = (element, options, callback) => {
  // Calculate proper width based on margins
  const effectiveWidth = 210 - options.margin[1] - options.margin[3]; // A4 width minus left and right margins
  
  return {
    callback,
    margin: options.margin,
    x: options.margin[1],
    y: options.margin[0],
    width: effectiveWidth,
    windowWidth: PDF_CONFIG.rendering.windowWidth,
    html2canvas: options.html2canvas
  };
};

/**
 * Log element dimensions for debugging
 * @param {HTMLElement} element - The HTML element
 * @param {string} context - Context description
 */
const logElementDimensions = (element, context) => {
  const computedStyle = window.getComputedStyle(element);
  console.log(`${context} - Element details:`, {
    id: element.id,
    className: element.className,
    tagName: element.tagName,
    dimensions: {
      offsetWidth: element.offsetWidth,
      offsetHeight: element.offsetHeight,
      scrollWidth: element.scrollWidth,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      clientHeight: element.clientHeight
    },
    styles: {
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity,
      width: computedStyle.width,
      height: computedStyle.height
    },
    hasContent: element.innerHTML.length > 0,
    childrenCount: element.children.length
  });
};

/**
 * Export HTML element to PDF using unified configuration
 * @param {string} elementId - The ID of the HTML element to export
 * @param {string} filename - The name of the PDF file (without extension)
 * @param {Object} customOptions - Custom options to override defaults
 */
export const exportToPDF = async (elementId, filename = 'report', customOptions = {}) => {
  try {
    // Get the HTML element
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log('Starting PDF export for element:', elementId);
    console.log('Element found:', element.tagName, element.className);
    
    // Get unified PDF options
    const options = getPDFOptions({ filename: `${filename}.pdf`, ...customOptions });
    console.log('PDF options:', options);

    // Create jsPDF instance
    const pdf = createPDFInstance(options);

    // Use jsPDF's html() method to convert HTML to PDF
    await pdf.html(element, getHTMLRenderOptions(element, options, function (pdf) {
      logElementDimensions(element, 'PDF Export');
      console.log('PDF generation completed, saving file...');
      // Save the PDF
      pdf.save(options.filename);
    }));

    console.log(`PDF "${options.filename}" generated successfully!`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error details:', {
      elementId,
      filename,
      customOptions,
      elementExists: !!document.getElementById(elementId)
    });
    throw error;
  }
};

/**
 * Export multiple reports to a single PDF using unified configuration
 * @param {Array} elementIds - Array of element IDs to include in the PDF
 * @param {string} filename - The name of the PDF file
 * @param {Object} customOptions - Custom options to override defaults
 */
export const exportMultipleReportsToPDF = async (elementIds, filename = 'combined-report', customOptions = {}) => {
  try {
    // Get unified PDF options
    const options = getPDFOptions({ filename: `${filename}.pdf`, ...customOptions });
    
    // Create jsPDF instance
    const pdf = createPDFInstance(options);

    let isFirstPage = true;

    // Process each element
    for (const elementId of elementIds) {
      const element = document.getElementById(elementId);
      
      if (!element) {
        console.warn(`Element with ID "${elementId}" not found, skipping...`);
        continue;
      }

      // Add new page for subsequent reports
      if (!isFirstPage) {
        pdf.addPage();
      }

      // Convert current element to PDF and add to the document
      await new Promise((resolve) => {
        pdf.html(element, getHTMLRenderOptions(element, options, function () {
          resolve();
        }));
      });

      isFirstPage = false;
    }

    // Save the combined PDF
    pdf.save(options.filename);
    console.log(`Combined PDF "${options.filename}" generated successfully!`);
    return true;
  } catch (error) {
    console.error('Error generating combined PDF:', error);
    throw error;
  }
};

/**
 * Preview PDF before downloading using unified configuration
 * @param {string} elementId - The ID of the HTML element to preview
 * @param {Object} customOptions - Custom options to override defaults
 */
export const previewPDF = async (elementId, customOptions = {}) => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get unified PDF options
    const options = getPDFOptions(customOptions);
    
    // Create jsPDF instance
    const pdf = createPDFInstance(options);

    await pdf.html(element, getHTMLRenderOptions(element, options, function (pdf) {
      logElementDimensions(element, 'PDF Preview');
      // Open PDF in new tab for preview
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    }));

    return true;
  } catch (error) {
    console.error('Error previewing PDF:', error);
    throw error;
  }
};

/**
 * Get PDF as base64 string using unified configuration
 * @param {string} elementId - The ID of the HTML element to convert
 * @param {Object} customOptions - Custom options to override defaults
 * @returns {Promise<string>} Base64 encoded PDF string
 */
export const getPDFAsBase64 = async (elementId, customOptions = {}) => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Get unified PDF options
    const options = getPDFOptions(customOptions);
    
    // Create jsPDF instance
    const pdf = createPDFInstance(options);

    return new Promise((resolve, reject) => {
      pdf.html(element, getHTMLRenderOptions(element, options, function (pdf) {
        try {
          const base64 = pdf.output('datauristring');
          resolve(base64);
        } catch (error) {
          reject(error);
        }
      }));
    });
  } catch (error) {
    console.error('Error getting PDF as base64:', error);
    throw error;
  }
};

/**
 * Update PDF configuration at runtime
 * @param {Object} newConfig - New configuration values to merge
 */
export const updatePDFConfig = (newConfig) => {
  Object.assign(PDF_CONFIG, newConfig);
  console.log('PDF configuration updated:', PDF_CONFIG);
};

/**
 * Get current PDF configuration
 * @returns {Object} Current PDF configuration
 */
export const getPDFConfig = () => {
  return { ...PDF_CONFIG };
};