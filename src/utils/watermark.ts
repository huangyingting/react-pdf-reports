/**
 * Watermark Utility for PDF Generation
 * Provides functions to add watermarks to PDF pages using jsPDF
 */

import jsPDF from 'jspdf';

// Type definitions
export interface WatermarkFont {
  family?: string;
  style?: string;
}

export interface WatermarkItem {
  text: string;
  opacity?: number;
  position?: 'center' | 'diagonal' | 'header' | 'footer' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'custom';
  rotation?: number;
  color?: string;
  fontSize?: number;
  font?: WatermarkFont;
  align?: 'left' | 'center' | 'right';
  baseline?: 'top' | 'middle' | 'bottom';
  offsetX?: number;
  offsetY?: number;
  lineHeightMultiplier?: number;
  pages?: number[] | ((pageNumber: number) => boolean) | { from?: number; to?: number; interval?: number };
  x?: number;
  y?: number;
  _autoFontSize?: boolean;
}

export interface WatermarkOptions {
  items?: WatermarkItem[];
  font?: WatermarkFont;
  text?: string;
  color?: string;
  opacity?: number;
  fontSize?: number;
  position?: string;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  x?: number;
  y?: number;
  __isNormalized?: boolean;
}

export interface PageInfo {
  width: number;
  height: number;
}

interface TextDimensions {
  textWidth: number;
  textHeight: number;
}

interface Coordinates {
  x: number;
  y: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

const DEFAULT_WATERMARK_FONT: WatermarkFont = {
  family: 'helvetica',
  style: 'bold'
};

const DEFAULT_WATERMARK_ITEM: Partial<WatermarkItem> = {
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

const normalizeWatermarkOptions = (watermarkOptions: WatermarkOptions = {}): WatermarkOptions => {
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

  const baseFont: WatermarkFont = {
    ...DEFAULT_WATERMARK_FONT,
    ...(font || {})
  };

  const topLevelFontSizeProvided = Object.prototype.hasOwnProperty.call(watermarkOptions, 'fontSize');

  const sourceItems: Partial<WatermarkItem>[] = Array.isArray(items) && items.length > 0
    ? items
    : (text ? [{ text }] : []);

  const normalizedItems: WatermarkItem[] = sourceItems
    .map((rawItem): WatermarkItem | null => {
      if (!rawItem || !rawItem.text) return null;

      const fontSizeProvided = topLevelFontSizeProvided || Object.prototype.hasOwnProperty.call(rawItem, 'fontSize');

      const merged: any = {
        ...DEFAULT_WATERMARK_ITEM,
        ...shared,
        ...rawItem
      };

      const resolvedFont: WatermarkFont = {
        ...baseFont,
        ...(rawItem?.font || {})
      };

      merged.font = resolvedFont;
      merged._autoFontSize = !fontSizeProvided;

      return merged as WatermarkItem;
    })
    .filter((item): item is WatermarkItem => item !== null);

  const normalized: WatermarkOptions = {
    ...watermarkOptions,
    items: normalizedItems,
    __isNormalized: true
  };

  if (!normalized.text && normalizedItems[0]?.text) {
    normalized.text = normalizedItems[0].text;
  }

  return normalized;
};

const shouldRenderOnPage = (item: WatermarkItem, pageNumber: number): boolean => {
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
 */
export const calculateWatermarkPosition = (
  pageInfo: PageInfo,
  watermarkOptions: WatermarkItem,
  textDimensions: TextDimensions
): Coordinates => {
  const { width, height } = pageInfo;
  const { position = 'center', offsetX = 0, offsetY = 0 } = watermarkOptions;
  const { textWidth, textHeight } = textDimensions;

  const margin = 20; // Margin from edges

  let coordinates: Coordinates = {
    x: width / 2,
    y: height / 2
  };

  switch (position) {
    case 'center':
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
 */
export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 153, g: 153, b: 153 }; // Default gray
};

/**
 * Apply watermark to a single PDF page
 */
export const applyWatermarkToPage = (
  pdf: jsPDF,
  watermarkOptions: WatermarkOptions,
  pageNumber: number = 1
): void => {
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

  const hasGraphicsStateSupport = typeof (pdf as any).saveGraphicsState === 'function' && 
                                   typeof (pdf as any).restoreGraphicsState === 'function';

  items.forEach((item) => {
    if (!item?.text) {
      return;
    }

    if (!shouldRenderOnPage(item, pageNumber)) {
      return;
    }

    if (hasGraphicsStateSupport) {
      (pdf as any).saveGraphicsState();
    }

    try {
      const {
        text,
        opacity,
        rotation = 0,
        color = '#999999',
        fontSize = 72,
        font,
        align = 'center',
        baseline = 'middle',
        lineHeightMultiplier = DEFAULT_WATERMARK_ITEM.lineHeightMultiplier as number
      } = item;

      const rgb = hexToRgb(color);

      if (typeof pdf.setTextColor === 'function') {
        pdf.setTextColor(rgb.r, rgb.g, rgb.b);
      }

      if (typeof pdf.setFontSize === 'function') {
        pdf.setFontSize(fontSize);
      }

      const fontFamily = font?.family || DEFAULT_WATERMARK_FONT.family!;
      const fontStyle = font?.style || DEFAULT_WATERMARK_FONT.style!;

      if (typeof pdf.setFont === 'function') {
        pdf.setFont(fontFamily, fontStyle);
      }

      if (typeof (pdf as any).setGState === 'function') {
        const gStateOptions = { opacity };
        if (typeof (pdf as any).GState === 'function') {
          (pdf as any).setGState((pdf as any).GState(gStateOptions));
        } else {
          (pdf as any).setGState(gStateOptions);
        }
      }

      const textWidth = pdf.getTextWidth ? pdf.getTextWidth(text) : 0;
      const textHeight = fontSize * lineHeightMultiplier;

      const positionCoords = calculateWatermarkPosition(
        { width: pageWidth, height: pageHeight },
        item,
        { textWidth, textHeight }
      );

      const textOptions: any = {
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
        (pdf as any).restoreGraphicsState();
      }
    }
  });
};

/**
 * Apply watermark to all pages in a PDF
 */
export const applyWatermarkToAllPages = (
  pdf: jsPDF,
  watermarkOptions: WatermarkOptions
): void => {
  if (!pdf) {
    return;
  }

  const normalized = normalizeWatermarkOptions(watermarkOptions);
  const { items = [] } = normalized;

  if (!items.length) {
    return;
  }

  const totalPages = typeof (pdf as any).internal.getNumberOfPages === 'function'
    ? (pdf as any).internal.getNumberOfPages()
    : ((pdf as any).internal.pages.length - 1);
  
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    applyWatermarkToPage(pdf, normalized, i);
  }
};

/**
 * Create a callback function that applies watermarks after PDF generation
 */
export const createWatermarkCallback = (watermarkOptions: WatermarkOptions) => {
  const normalized = normalizeWatermarkOptions(watermarkOptions);

  return function(pdf: jsPDF) {
    if (normalized.items && normalized.items.length) {
      console.log('Applying watermarks to PDF pages...');
      applyWatermarkToAllPages(pdf, normalized);
      console.log('Watermarks applied successfully');
    }
    
    if ((pdf as any).save) {
      (pdf as any).save();
    }
  };
};

/**
 * Enhanced watermark options with intelligent font sizing
 */
export const enhanceWatermarkOptions = (
  watermarkOptions: WatermarkOptions | null,
  pageInfo?: PageInfo
): WatermarkOptions | null => {
  if (!watermarkOptions) return null;

  const normalized = normalizeWatermarkOptions(watermarkOptions);
  const { items } = normalized;

  if (!items || !items.length) {
    return null;
  }

  if (!pageInfo || typeof pageInfo.width !== 'number' || typeof pageInfo.height !== 'number') {
    return normalized;
  }

  const { width, height } = pageInfo;
  const diagonal = Math.sqrt(width * width + height * height);
  const baseFontSize = Math.min(width, height) / 8;

  const enhancedItems: WatermarkItem[] = items.map((item) => {
    const { _autoFontSize, text, ...rest } = item;

    if (!_autoFontSize) {
      return {
        ...rest,
        text
      } as WatermarkItem;
    }

    const cleanedText = (text || '').trim();
    const textLength = cleanedText.replace(/\s+/g, '').length || cleanedText.length || 10;
    const adjustedFontSize = Math.max(20, Math.min(baseFontSize, (diagonal / textLength) * 2));

    return {
      ...rest,
      text,
      fontSize: adjustedFontSize
    } as WatermarkItem;
  });

  return {
    ...normalized,
    items: enhancedItems,
    text: enhancedItems[0]?.text || normalized.text,
    __isNormalized: true
  };
};
