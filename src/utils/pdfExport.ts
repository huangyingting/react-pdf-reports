import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { applyWatermarkToAllPages, enhanceWatermarkOptions } from './watermark';

/**
 * Quality settings for PDF export
 */
interface QualitySettings {
  scale: number;
  quality: number;
  description: string;
}

/**
 * Image quality presets
 */
interface ImageQuality {
  poor: QualitySettings;
  standard: QualitySettings;
  high: QualitySettings;
}

/**
 * Quality level type
 */
type QualityLevel = 'poor' | 'standard' | 'high';

/**
 * Custom options for PDF export
 */
interface ExportOptions {
  qualityLevel?: QualityLevel;
  [key: string]: any;
}

/**
 * Element dimension information
 */
interface ElementDimensions {
  offsetWidth: number;
  offsetHeight: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
}

/**
 * Element styles information
 */
interface ElementStyles {
  display: string;
  visibility: string;
  opacity: string;
  width: string;
  height: string;
}

/**
 * Element debug information
 */
interface ElementDebugInfo {
  id: string;
  className: string;
  tagName: string;
  dimensions: ElementDimensions;
  styles: ElementStyles;
  hasContent: boolean;
  childrenCount: number;
}

/**
 * Log element dimensions for debugging
 * @param element - The HTML element
 * @param context - Context description
 */
const logElementDimensions = (element: HTMLElement, context: string): void => {
  const computedStyle = window.getComputedStyle(element);
  const debugInfo: ElementDebugInfo = {
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
  };
  console.log(`${context} - Element details:`, debugInfo);
};

/**
 * Export HTML element to PDF using unified configuration
 * @param elementId - The ID of the HTML element to export
 * @param filename - The name of the PDF file (without extension)
 * @param customOptions - Custom options to override defaults
 * @param enableWatermark - Whether to add watermark to all pages
 */
export const exportToPDF = async (
  elementId: string,
  filename: string = 'report',
  customOptions: ExportOptions = {},
  enableWatermark: boolean = false
): Promise<boolean> => {
  try {
    // Get the HTML element
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log('Starting PDF export for element:', elementId);
    console.log('Element found:', element.tagName, element.className);

    const explicitPageSelectors = ['.cms1500-page', '.medical-page', '.report-page', '[data-pdf-page]'];
    const explicitPages = explicitPageSelectors.reduce(
      (count, selector) => count + element.querySelectorAll(selector).length,
      0
    );
    const pageBreaks = element.querySelectorAll('.page-break').length;
    const expectedPages = Math.max(explicitPages, pageBreaks > 0 ? pageBreaks + 1 : 0, 1);
    console.log(`Expected PDF pages based on DOM markers: ${expectedPages}`);

    // Create jsPDF instance
    const pdf = new jsPDF({
      format: 'a4',
      orientation: 'portrait',
      unit: 'mm'
    });

    // Use jsPDF's html() method to convert HTML to PDF
    await pdf.html(element, {
      // The callback is called when the rendering is complete
      callback: function (pdf: jsPDF) {
        logElementDimensions(element, 'PDF Export');
        
        // Remove any extra pages beyond what the DOM defines (common jsPDF quirk)
        let adjustedTotal = (pdf as any).internal.getNumberOfPages();
        if (adjustedTotal > expectedPages) {
          console.log(`Pruning ${adjustedTotal - expectedPages} unexpected trailing page(s)`);
          for (let pageNumber = adjustedTotal; pageNumber > expectedPages; pageNumber--) {
            pdf.deletePage(pageNumber);
          }
        }

        // Apply watermark if enabled
        if (enableWatermark) {
          const pageInfo = { width: 210, height: 297 }; // A4 dimensions in mm
          const watermarkOptions = enhanceWatermarkOptions({
            color: '#999999',
            opacity: 0.18,
            font: {
              family: 'helvetica',
              style: 'bold'
            },
            items: [
              {
                text: 'Educational Use Only',
                position: 'diagonal',
                rotation: -45,
                opacity: 0.22
              },
              {
                text: 'Educational Use Only',
                position: 'diagonal',
                rotation: -45,
                offsetX: -70,
                offsetY: -110
              },
              {
                text: 'Educational Use Only',
                position: 'diagonal',
                rotation: -45,
                offsetX: 70,
                offsetY: 110
              },
              {
                text: 'Educational Use Only',
                position: 'diagonal',
                rotation: 45,
                opacity: 0.22
              },
              {
                text: 'Educational Use Only',
                position: 'diagonal',
                rotation: 45,
                offsetX: -70,
                offsetY: 110
              },
              {
                text: 'Educational Use Only',
                position: 'diagonal',
                rotation: 45,
                offsetX: 70,
                offsetY: -110
              }
            ]
          }, pageInfo);
          
          if (watermarkOptions) {
            console.log('Adding watermark to all pages...');
            applyWatermarkToAllPages(pdf, watermarkOptions);
            console.log('Watermark applied successfully');
          }
        }

        console.log(`Total pages after cleanup: ${(pdf as any).internal.getNumberOfPages()}`);
        pdf.save(`${filename}.pdf`);
        console.log("PDF saved successfully!");
      },
      x: 0, // horizontal margin
      y: 0, // vertical margin
      width: 210, // content width in the PDF, 210mm for A4 size
      windowWidth: 794 // width of the virtual browser window, 210mm at 96 DPI
    });

    console.log(`PDF "${filename}.pdf" generated successfully!`);
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
 * Export HTML element to PDF as image using improved method
 * This method captures the HTML element as an image and embeds it in a PDF
 * @param elementId - The ID of the HTML element to export
 * @param filename - The name of the PDF file (without extension)
 * @param customOptions - Custom options to override defaults
 * @param enableWatermark - Whether to add watermark to all pages
 */
export const exportToPDFAsImage = async (
  elementId: string,
  filename: string = 'report-image',
  customOptions: ExportOptions = {},
  enableWatermark: boolean = false
): Promise<boolean> => {
  const imageQuality: ImageQuality = {
    poor: {
      scale: 1,
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
  };

  try {
    // Get the HTML element
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    console.log('Starting PDF as image export for element:', elementId);

    // Determine quality settings
    const qualityLevel: QualityLevel = customOptions.qualityLevel || 'standard';
    const qualitySettings: QualitySettings = imageQuality[qualityLevel] || imageQuality.standard;

    console.log(`Using ${qualitySettings.description} (scale: ${qualitySettings.scale}, quality: ${qualitySettings.quality})`);

    // Find all page elements (everything that's not a page break)
    const allChildren = Array.from(element.children) as HTMLElement[];
    const pages: HTMLElement[][] = [];
    let currentPage: HTMLElement[] = [];

    console.log(`Total child elements found: ${allChildren.length}`);
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
        } as any);

        // Convert to image using quality settings
        const imgData = canvas.toDataURL('image/jpeg', qualitySettings.quality);

        // Add the image to PDF - it should fit exactly since we used the same dimensions
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidthMM, pageHeightMM);

        console.log(`Added page ${i + 1} to PDF (${pageWidthMM}mm x ${pageHeightMM}mm)`);

      } finally {
        // Clean up page container
        document.body.removeChild(pageContainer);
      }
    }

    // Apply watermark if enabled
    if (enableWatermark) {
      const watermarkOptions = enhanceWatermarkOptions({
        color: '#999999',
        opacity: 0.18,
        font: {
          family: 'helvetica',
          style: 'bold'
        },
        items: [
          {
            text: 'Educational Use Only',
            position: 'diagonal',
            rotation: -45,
            opacity: 0.22
          },
          {
            text: 'Educational Use Only',
            position: 'diagonal',
            rotation: -45,
            offsetX: -70,
            offsetY: -110
          },
          {
            text: 'Educational Use Only',
            position: 'diagonal',
            rotation: -45,
            offsetX: 70,
            offsetY: 110
          },
          {
            text: 'Educational Use Only',
            position: 'diagonal',
            rotation: 45,
            opacity: 0.22
          },
          {
            text: 'Educational Use Only',
            position: 'diagonal',
            rotation: 45,
            offsetX: -70,
            offsetY: 110
          },
          {
            text: 'Educational Use Only',
            position: 'diagonal',
            rotation: 45,
            offsetX: 70,
            offsetY: -110
          }
        ]
      }, { width: pageWidthMM, height: pageHeightMM });
      
      if (watermarkOptions) {
        console.log('Adding watermark to all pages...');
        applyWatermarkToAllPages(pdf, watermarkOptions);
        console.log('Watermark applied successfully');
      }
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);
    console.log(`PDF with image "${filename}.pdf" generated successfully!`);
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
