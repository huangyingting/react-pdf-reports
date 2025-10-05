/**
 * Watermark Utility for PDF Generation
 * Provides functions to add watermarks to PDF pages using jsPDF
 */

/**
 * Calculate watermark position based on page dimensions and position setting
 * @param {Object} pageInfo - Page information (width, height)
 * @param {Object} watermarkOptions - Watermark configuration
 * @param {Object} textDimensions - Text dimensions
 * @returns {Object} Position coordinates {x, y}
 */
export const calculateWatermarkPosition = (pageInfo, watermarkOptions, textDimensions) => {
  const { width, height } = pageInfo;
  const { position } = watermarkOptions;
  const { textWidth, textHeight } = textDimensions;

  const margin = 20; // Margin from edges

  switch (position) {
    case 'center':
      return {
        x: width / 2,
        y: height / 2
      };
    
    case 'diagonal':
      return {
        x: width / 2,
        y: height / 2
      };
    
    case 'header':
      return {
        x: width / 2,
        y: margin + textHeight
      };
    
    case 'footer':
      return {
        x: width / 2,
        y: height - margin
      };
    
    case 'top-left':
      return {
        x: margin + textWidth / 2,
        y: margin + textHeight
      };
    
    case 'top-right':
      return {
        x: width - margin - textWidth / 2,
        y: margin + textHeight
      };
    
    case 'bottom-left':
      return {
        x: margin + textWidth / 2,
        y: height - margin
      };
    
    case 'bottom-right':
      return {
        x: width - margin - textWidth / 2,
        y: height - margin
      };
    
    default:
      return {
        x: width / 2,
        y: height / 2
      };
  }
};

/**
 * Convert hex color to RGB values
 * @param {string} hex - Hex color code
 * @returns {Object} RGB values {r, g, b}
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 153, g: 153, b: 153 }; // Default gray
};

/**
 * Apply watermark to a single PDF page
 * @param {jsPDF} pdf - jsPDF instance
 * @param {Object} watermarkOptions - Watermark configuration
 * @param {number} pageNumber - Current page number (1-based)
 */
export const applyWatermarkToPage = (pdf, watermarkOptions, pageNumber = 1) => {
  if (!watermarkOptions || !watermarkOptions.text) {
    return;
  }

  const {
    text,
    opacity = 0.3,
    position = 'diagonal',
    rotation = -45,
    color = '#999999',
    fontSize = 50
  } = watermarkOptions;

  // Get page dimensions
  const pageInfo = pdf.internal.pageSize;
  const pageWidth = pageInfo.getWidth();
  const pageHeight = pageInfo.getHeight();

  // Save current graphics state
  pdf.saveGraphicsState();

  try {
    // Convert color to RGB
    const rgb = hexToRgb(color);
    
    // Set text properties
    pdf.setTextColor(rgb.r, rgb.g, rgb.b);
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', 'bold');
    
    // Set opacity
    pdf.setGState(pdf.GState({ opacity: opacity }));
    
    // Get text dimensions
    const textWidth = pdf.getTextWidth(text);
    const textHeight = fontSize * 0.75; // Approximate text height

    // Calculate position
    const position_coords = calculateWatermarkPosition(
      { width: pageWidth, height: pageHeight },
      { position },
      { textWidth, textHeight }
    );

    // Apply rotation and position
    if (rotation !== 0) {
      // For rotated text, we need to translate to the position first
      pdf.text(
        text,
        position_coords.x,
        position_coords.y,
        {
          angle: rotation,
          align: 'center',
          baseline: 'middle'
        }
      );
    } else {
      // For non-rotated text
      pdf.text(
        text,
        position_coords.x,
        position_coords.y,
        {
          align: 'center',
          baseline: 'middle'
        }
      );
    }

  } catch (error) {
    console.error('Error applying watermark:', error);
  } finally {
    // Restore graphics state
    pdf.restoreGraphicsState();
  }
};

/**
 * Apply watermark to all pages in a PDF
 * @param {jsPDF} pdf - jsPDF instance
 * @param {Object} watermarkOptions - Watermark configuration
 */
export const applyWatermarkToAllPages = (pdf, watermarkOptions) => {
  if (!watermarkOptions || !watermarkOptions.text) {
    return;
  }

  const totalPages = pdf.internal.pages.length - 1; // jsPDF pages array includes an empty first element
  
  for (let i = 1; i <= totalPages; i++) {
    // Go to each page
    pdf.setPage(i);
    // Apply watermark
    applyWatermarkToPage(pdf, watermarkOptions, i);
  }
};

/**
 * Create a callback function that applies watermarks after PDF generation
 * @param {Object} watermarkOptions - Watermark configuration
 * @returns {Function} Callback function for jsPDF
 */
export const createWatermarkCallback = (watermarkOptions) => {
  return function(pdf) {
    if (watermarkOptions && watermarkOptions.text) {
      console.log('Applying watermarks to PDF pages...');
      applyWatermarkToAllPages(pdf, watermarkOptions);
      console.log('Watermarks applied successfully');
    }
    
    // Save the PDF
    if (pdf.save) {
      pdf.save();
    }
  };
};

/**
 * Enhanced watermark options with intelligent font sizing
 * @param {Object} watermarkOptions - Base watermark options
 * @param {Object} pageInfo - Page dimensions
 * @returns {Object} Enhanced options with appropriate font size
 */
export const enhanceWatermarkOptions = (watermarkOptions, pageInfo) => {
  if (!watermarkOptions) return null;

  const { width, height } = pageInfo;
  const diagonal = Math.sqrt(width * width + height * height);
  
  // Calculate appropriate font size based on page size and text length
  const textLength = watermarkOptions.text ? watermarkOptions.text.length : 10;
  const baseFontSize = Math.min(width, height) / 8; // Base size relative to smaller dimension
  const adjustedFontSize = Math.max(20, Math.min(baseFontSize, diagonal / textLength * 2));

  return {
    ...watermarkOptions,
    fontSize: watermarkOptions.fontSize || adjustedFontSize
  };
};