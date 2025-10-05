/**
 * Watermark Utility for PDF Generation
 * Provides functions to add watermarks to PDF pages using jsPDF
 */

const DEFAULT_WATERMARK_FONT = {
  family: 'helvetica',
  style: 'bold'
};

const DEFAULT_WATERMARK_ITEM = {
  opacity: 0.3,
  position: 'diagonal',
  rotation: -45,
  color: '#999999',
  fontSize: 72,
  align: 'center',
  baseline: 'middle',
  offsetX: 0,
  offsetY: 0,
  lineHeightMultiplier: 0.75
};

const normalizeWatermarkOptions = (watermarkOptions = {}) => {
  if (!watermarkOptions) {
    return {
      items: [],
      __isNormalized: true
    };
  }

  if (watermarkOptions.__isNormalized) {
    return watermarkOptions;
  }

  const {
    items,
    font,
    text,
    ...shared
  } = watermarkOptions;

  const baseFont = {
    ...DEFAULT_WATERMARK_FONT,
    ...(font || {})
  };

  const topLevelFontSizeProvided = Object.prototype.hasOwnProperty.call(watermarkOptions, 'fontSize');

  const sourceItems = Array.isArray(items) && items.length > 0
    ? items
    : (text ? [{ text }] : []);

  const normalizedItems = sourceItems
    .map((rawItem) => {
      if (!rawItem) return null;

      const fontSizeProvided = topLevelFontSizeProvided || Object.prototype.hasOwnProperty.call(rawItem, 'fontSize');

      const merged = {
        ...DEFAULT_WATERMARK_ITEM,
        ...shared,
        ...rawItem
      };

      const resolvedFont = {
        ...baseFont,
        ...(rawItem?.font || {})
      };

      merged.font = resolvedFont;
      merged._autoFontSize = !fontSizeProvided;

      if (!merged.text) {
        return null;
      }

      return merged;
    })
    .filter(Boolean);

  const normalized = {
    ...watermarkOptions,
    items: normalizedItems,
    __isNormalized: true
  };

  if (!normalized.text && normalizedItems[0]?.text) {
    normalized.text = normalizedItems[0].text;
  }

  return normalized;
};

const shouldRenderOnPage = (item, pageNumber) => {
  if (!item) {
    return false;
  }

  const { pages } = item;

  if (!pages) {
    return true;
  }

  if (Array.isArray(pages)) {
    return pages.includes(pageNumber);
  }

  if (typeof pages === 'function') {
    try {
      return !!pages(pageNumber);
    } catch (error) {
      console.error('Error evaluating watermark page rule function:', error);
      return false;
    }
  }

  if (typeof pages === 'object') {
    const { from = 1, to = Number.POSITIVE_INFINITY, interval = 1 } = pages;

    if (pageNumber < from || pageNumber > to) {
      return false;
    }

    const effectiveInterval = interval || 1;
    return ((pageNumber - from) % effectiveInterval) === 0;
  }

  return false;
};

/**
 * Calculate watermark position based on page dimensions and position setting
 * @param {Object} pageInfo - Page information (width, height)
 * @param {Object} watermarkOptions - Watermark configuration
 * @param {Object} textDimensions - Text dimensions
 * @returns {Object} Position coordinates {x, y}
 */
export const calculateWatermarkPosition = (pageInfo, watermarkOptions, textDimensions) => {
  const { width, height } = pageInfo;
  const { position = 'center', offsetX = 0, offsetY = 0 } = watermarkOptions;
  const { textWidth, textHeight } = textDimensions;

  const margin = 20; // Margin from edges

  let coordinates = {
    x: width / 2,
    y: height / 2
  };

  switch (position) {
    case 'center':
      coordinates = {
        x: width / 2,
        y: height / 2
      };
      break;

    case 'diagonal':
      coordinates = {
        x: width / 2,
        y: height / 2
      };
      break;

    case 'header':
      coordinates = {
        x: width / 2,
        y: margin + textHeight
      };
      break;

    case 'footer':
      coordinates = {
        x: width / 2,
        y: height - margin
      };
      break;

    case 'top-left':
      coordinates = {
        x: margin + textWidth / 2,
        y: margin + textHeight
      };
      break;

    case 'top-right':
      coordinates = {
        x: width - margin - textWidth / 2,
        y: margin + textHeight
      };
      break;

    case 'bottom-left':
      coordinates = {
        x: margin + textWidth / 2,
        y: height - margin
      };
      break;

    case 'bottom-right':
      coordinates = {
        x: width - margin - textWidth / 2,
        y: height - margin
      };
      break;

    case 'custom':
      coordinates = {
        x: typeof watermarkOptions.x === 'number' ? watermarkOptions.x : width / 2,
        y: typeof watermarkOptions.y === 'number' ? watermarkOptions.y : height / 2
      };
      break;

    default:
      coordinates = {
        x: width / 2,
        y: height / 2
      };
  }

  return {
    x: coordinates.x + offsetX,
    y: coordinates.y + offsetY
  };
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
  if (!pdf) {
    return;
  }

  const normalized = normalizeWatermarkOptions(watermarkOptions);
  const { items = [] } = normalized;

  if (!items.length) {
    return;
  }

  const pageInfo = pdf.internal.pageSize;
  const pageWidth = pageInfo.getWidth();
  const pageHeight = pageInfo.getHeight();

  const hasGraphicsStateSupport = typeof pdf.saveGraphicsState === 'function' && typeof pdf.restoreGraphicsState === 'function';

  items.forEach((item) => {
    if (!item?.text) {
      return;
    }

    if (!shouldRenderOnPage(item, pageNumber)) {
      return;
    }

    if (hasGraphicsStateSupport) {
      pdf.saveGraphicsState();
    }

    try {
      const {
        text,
        opacity,
        rotation = 0,
        color,
        fontSize,
        font,
        align = 'center',
        baseline = 'middle',
        lineHeightMultiplier = DEFAULT_WATERMARK_ITEM.lineHeightMultiplier
      } = item;

      const rgb = hexToRgb(color);

      if (typeof pdf.setTextColor === 'function') {
        pdf.setTextColor(rgb.r, rgb.g, rgb.b);
      }

      if (typeof pdf.setFontSize === 'function') {
        pdf.setFontSize(fontSize);
      }

      const fontFamily = font?.family || DEFAULT_WATERMARK_FONT.family;
      const fontStyle = font?.style || DEFAULT_WATERMARK_FONT.style;

      if (typeof pdf.setFont === 'function') {
        pdf.setFont(fontFamily, fontStyle);
      }

      if (typeof pdf.setGState === 'function') {
        const gStateOptions = { opacity };
        if (typeof pdf.GState === 'function') {
          pdf.setGState(pdf.GState(gStateOptions));
        } else {
          pdf.setGState(gStateOptions);
        }
      }

      const textWidth = pdf.getTextWidth ? pdf.getTextWidth(text) : 0;
      const textHeight = fontSize * lineHeightMultiplier;

      const positionCoords = calculateWatermarkPosition(
        { width: pageWidth, height: pageHeight },
        item,
        { textWidth, textHeight }
      );

      const textOptions = {
        align,
        baseline
      };

      if (rotation) {
        textOptions.angle = rotation;
      }

      pdf.text(
        text,
        positionCoords.x,
        positionCoords.y,
        textOptions
      );

    } catch (error) {
      console.error('Error applying watermark item:', error);
    } finally {
      if (hasGraphicsStateSupport) {
        pdf.restoreGraphicsState();
      }
    }
  });
};

/**
 * Apply watermark to all pages in a PDF
 * @param {jsPDF} pdf - jsPDF instance
 * @param {Object} watermarkOptions - Watermark configuration
 */
export const applyWatermarkToAllPages = (pdf, watermarkOptions) => {
  if (!pdf) {
    return;
  }

  const normalized = normalizeWatermarkOptions(watermarkOptions);
  const { items = [] } = normalized;

  if (!items.length) {
    return;
  }

  const totalPages = typeof pdf.internal.getNumberOfPages === 'function'
    ? pdf.internal.getNumberOfPages()
    : (pdf.internal.pages.length - 1);
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    applyWatermarkToPage(pdf, normalized, i);
  }
};

/**
 * Create a callback function that applies watermarks after PDF generation
 * @param {Object} watermarkOptions - Watermark configuration
 * @returns {Function} Callback function for jsPDF
 */
export const createWatermarkCallback = (watermarkOptions) => {
  const normalized = normalizeWatermarkOptions(watermarkOptions);

  return function(pdf) {
    if (normalized.items.length) {
      console.log('Applying watermarks to PDF pages...');
      applyWatermarkToAllPages(pdf, normalized);
      console.log('Watermarks applied successfully');
    }
    
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

  const normalized = normalizeWatermarkOptions(watermarkOptions);
  const { items } = normalized;

  if (!items.length) {
    return null;
  }

  if (!pageInfo || typeof pageInfo.width !== 'number' || typeof pageInfo.height !== 'number') {
    return normalized;
  }

  const { width, height } = pageInfo;
  const diagonal = Math.sqrt(width * width + height * height);
  const baseFontSize = Math.min(width, height) / 8;

  const enhancedItems = items.map((item) => {
    const { _autoFontSize, text, ...rest } = item;

    if (!_autoFontSize) {
      return {
        ...rest,
        text
      };
    }

    const cleanedText = (text || '').trim();
    const textLength = cleanedText.replace(/\s+/g, '').length || cleanedText.length || 10;
    const adjustedFontSize = Math.max(20, Math.min(baseFontSize, (diagonal / textLength) * 2));

    return {
      ...rest,
      text,
      fontSize: adjustedFontSize
    };
  });

  return {
    ...normalized,
    items: enhancedItems,
    text: enhancedItems[0]?.text || normalized.text,
    __isNormalized: true
  };
};