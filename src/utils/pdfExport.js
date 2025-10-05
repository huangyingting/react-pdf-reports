import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
    quality: 0.85,
    scale: 2 // Default standard quality
  },
  
  // Image quality presets
  imageQuality: {
    poor: {
      scale: 1.5 ,
      quality: 0.5,
      description: 'Poor Quality'
    },
    standard: {
      scale: 2,
      quality: 0.85,
      description: 'Standard Quality'
    },
    high: {
      scale: 4,
      quality: 0.95,
      description: 'High Quality'
    }
  },
  
  // HTML2Canvas rendering settings
  html2canvas: {
    useCORS: true,
    letterRendering: true,
    allowTaint: false
  },
  
  // Rendering settings
  rendering: {
    windowWidth: 794, // Optimized for medical records
    width: 210 // A4 width (210mm) minus margins (10mm total)
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

/**
 * Export HTML element to PDF as image using improved method
 * This method captures the HTML element as an image and embeds it in a PDF
 * @param {string} elementId - The ID of the HTML element to export
 * @param {string} filename - The name of the PDF file (without extension)
 * @param {Object} customOptions - Custom options to override defaults
 */
export const exportToPDFAsImage = async (elementId, filename = 'report-image', customOptions = {}) => {
  try {
    // Get the HTML element
    const element = document.getElementById(elementId);
    
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log('Starting PDF as image export for element:', elementId);
    
    // Determine quality settings
    const qualityLevel = customOptions.qualityLevel || 'standard';
    const qualitySettings = PDF_CONFIG.imageQuality[qualityLevel] || PDF_CONFIG.imageQuality.standard;
    
    console.log(`Using ${qualitySettings.description} (scale: ${qualitySettings.scale}, quality: ${qualitySettings.quality})`);
    
    // Get unified PDF options
    const options = getPDFOptions({ filename: `${filename}.pdf`, ...customOptions });
    
    // Find all page elements (everything that's not a page break)
    const allChildren = Array.from(element.children);
    const pages = [];
    let currentPage = [];
    
    for (const child of allChildren) {
      if (child.classList.contains('page-break')) {
        if (currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [];
        }
      } else {
        currentPage.push(child);
      }
    }
    
    // Add the last page if it has content
    if (currentPage.length > 0) {
      pages.push(currentPage);
    }
    
    if (pages.length === 0) {
      throw new Error('No page content found');
    }
    
    console.log(`Found ${pages.length} pages to process`);
    
    // Get dimensions from the first page element to set up PDF
    const firstPageElement = pages[0][0];
    const elementWidth = firstPageElement.offsetWidth;
    const elementHeight = firstPageElement.offsetHeight;
    
    // Convert pixels to mm (assuming 96 DPI)
    const pageWidthMM = (elementWidth * 25.4) / 96;
    const pageHeightMM = (elementHeight * 25.4) / 96;
    
    console.log(`Detected page dimensions: ${pageWidthMM}mm x ${pageHeightMM}mm`);
    
    // Create PDF with dimensions based on actual content
    const pdf = new jsPDF({
      orientation: pageWidthMM > pageHeightMM ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pageWidthMM, pageHeightMM],
      compress: true
    });

    // Process each page
    for (let i = 0; i < pages.length; i++) {
      console.log(`Processing page ${i + 1} of ${pages.length}`);
      
      // Create a temporary container for this page
      const pageContainer = document.createElement('div');
      pageContainer.style.position = 'absolute';
      pageContainer.style.left = '-9999px';
      pageContainer.style.top = '-9999px';
      pageContainer.style.width = elementWidth + 'px';
      pageContainer.style.height = elementHeight + 'px';
      pageContainer.style.backgroundColor = 'white';
      pageContainer.style.overflow = 'hidden';
      
      // Copy only essential styles, NO spacing styles
      const computedStyle = window.getComputedStyle(firstPageElement);
      pageContainer.style.fontFamily = computedStyle.fontFamily;
      pageContainer.style.fontSize = computedStyle.fontSize;
      pageContainer.style.lineHeight = computedStyle.lineHeight;
      pageContainer.style.color = computedStyle.color;
      
      // Explicitly reset all spacing to zero
      pageContainer.style.margin = '0';
      pageContainer.style.padding = '0';
      pageContainer.style.border = 'none';
      pageContainer.style.boxSizing = 'border-box';
      
      // Add page content to container
      pages[i].forEach(pageElement => {
        pageContainer.appendChild(pageElement.cloneNode(true));
      });
      
      document.body.appendChild(pageContainer);
      
      try {
        // Add new page for all pages after the first
        if (i > 0) {
          pdf.addPage([pageWidthMM, pageHeightMM]);
        }

        // Capture this page with html2canvas using quality settings
        const canvas = await html2canvas(pageContainer, {
          scale: qualitySettings.scale,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: elementWidth,
          height: elementHeight,
          windowWidth: elementWidth,
          windowHeight: elementHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });

        // Convert to image using quality settings
        const imgData = canvas.toDataURL(`image/${PDF_CONFIG.image.type}`, qualitySettings.quality);

        // Add the image to PDF - it should fit exactly since we used the same dimensions
        pdf.addImage(imgData, PDF_CONFIG.image.type.toUpperCase(), 0, 0, pageWidthMM, pageHeightMM);
        
        console.log(`Added page ${i + 1} to PDF (${pageWidthMM}mm x ${pageHeightMM}mm)`);
        
      } finally {
        // Clean up page container
        document.body.removeChild(pageContainer);
      }
    }

    // Save the PDF
    pdf.save(options.filename);
    console.log(`PDF with image "${options.filename}" generated successfully!`);
    return true;
    
  } catch (error) {
    console.error('Error generating PDF as image:', error);
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
 * Export multiple elements to PDF as images
 * Each element is captured as an image and added to separate pages
 * @param {Array} elementIds - Array of element IDs to include in the PDF
 * @param {string} filename - The name of the PDF file
 * @param {Object} customOptions - Custom options to override defaults
 */
export const exportMultipleElementsToPDFAsImages = async (elementIds, filename = 'combined-report-images', customOptions = {}) => {
  try {
    // Get unified PDF options
    const options = getPDFOptions({ filename: `${filename}.pdf`, ...customOptions });
    
    // Html2canvas specific options
    const canvasOptions = {
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scale: 2,
      logging: false,
      letterRendering: true,
      ...options.html2canvas,
      ...(customOptions.canvasOptions || {})
    };
    
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

      console.log(`Capturing element ${elementId} as image...`);
      
      // Capture the element as canvas
      const canvas = await html2canvas(element, canvasOptions);
      
      // Add new page for subsequent reports
      if (!isFirstPage) {
        pdf.addPage();
      }
      
      // Get PDF page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit the page
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Center the image on the page
      const x = (pageWidth - scaledWidth) / 2;
      const y = (pageHeight - scaledHeight) / 2;
      
      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      // Add image to PDF
      pdf.addImage(imgData, 'JPEG', x, y, scaledWidth, scaledHeight);

      isFirstPage = false;
    }

    // Save the combined PDF
    pdf.save(options.filename);
    console.log(`Combined PDF with images "${options.filename}" generated successfully!`);
    return true;
    
  } catch (error) {
    console.error('Error generating combined PDF with images:', error);
    throw error;
  }
};