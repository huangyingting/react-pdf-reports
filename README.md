# React PDF Report Generator

A modern React.js application that demonstrates how to export HTML content to PDF files using jsPDF's `.html()` method. This application generates professional reports and converts them to downloadable PDF documents.

## Features

- **Multiple Report Types**: Sales, Inventory, and Financial reports
- **Professional PDF Export**: Uses jsPDF's `.html()` method for high-quality PDF generation
- **Real-time Preview**: Preview PDFs before downloading
- **Combined Reports**: Export multiple reports into a single PDF file
- **Responsive Design**: Works on desktop and mobile devices
- **Professional Styling**: Clean, modern interface with print-optimized layouts

## Technologies Used

- **React.js** - Frontend framework
- **jsPDF** - PDF generation library
- **html2canvas** - HTML to canvas conversion (used by jsPDF)
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd react-pdf-reports
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Usage

### Viewing Reports

1. Use the navigation buttons to switch between different report types:
   - **Sales Report**: Shows product sales data with totals
   - **Inventory Report**: Displays stock levels with low-stock alerts
   - **Financial Report**: Presents revenue, expenses, and profit analysis

### Exporting to PDF

#### Single Report Export
1. Select the report you want to export using the navigation buttons
2. Click **"Download PDF"** to directly download the current report
3. Click **"Preview PDF"** to open the PDF in a new tab before downloading

#### Combined Report Export
- Click **"Download All Reports (Combined)"** to export all three reports into a single PDF file

### PDF Export Features

- **High Quality**: 2x scaling for crisp text and graphics
- **Professional Layout**: Optimized for A4 paper size
- **Print-Ready**: Proper margins and page formatting
- **Cross-Browser Compatible**: Works in all modern browsers

## Project Structure

```
src/
├── components/          # Report components
│   ├── SalesReport.js   # Sales report component
│   ├── InventoryReport.js # Inventory report component
│   └── FinancialReport.js # Financial report component
├── utils/               # Utility functions
│   ├── pdfExport.js     # PDF export functionality
│   └── sampleData.js    # Sample data for reports
├── App.js               # Main application component
├── App.css              # Application styles
└── index.js             # Application entry point
```

## Key Functions

### PDF Export Utilities (`src/utils/pdfExport.js`)

- **`exportToPDF(elementId, filename, options)`** - Export a single HTML element to PDF
- **`exportMultipleReportsToPDF(elementIds, filename, options)`** - Combine multiple reports into one PDF
- **`previewPDF(elementId, options)`** - Preview PDF in a new browser tab
- **`getPDFAsBase64(elementId, options)`** - Get PDF as base64 string for API uploads

### Sample Data (`src/utils/sampleData.js`)

Contains realistic sample data for all report types:
- Sales transactions with products, quantities, and totals
- Inventory items with stock levels and alerts
- Financial data with revenue/expense breakdowns

## Customization

### Adding New Report Types

1. Create a new component in `src/components/`
2. Add sample data to `src/utils/sampleData.js`
3. Import and integrate in `src/App.js`
4. Add styling in `src/App.css`

### Modifying PDF Options

Edit the default options in `src/utils/pdfExport.js`:

```javascript
const defaultOptions = {
  margin: [10, 10, 10, 10], // [top, left, bottom, right] in mm
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { 
    scale: 2,
    useCORS: true,
    letterRendering: true
  },
  jsPDF: { 
    unit: 'mm', 
    format: 'a4', 
    orientation: 'portrait' 
  }
};
```

### Styling Reports for PDF

The CSS includes special `@media print` rules and PDF-specific styling. Key considerations:

- Use absolute units (mm, pt) for precise PDF layout
- Avoid complex animations or transitions
- Test with different page sizes and orientations
- Ensure sufficient contrast for printing

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Performance Tips

- Large reports may take a few seconds to generate
- For better performance, consider paginating very large datasets
- The `scale: 2` option provides high quality but increases processing time
- Use `previewPDF()` for quick previews before final export

## Troubleshooting

### Common Issues

1. **PDF generation fails**: Ensure the target element has a proper ID and is visible
2. **Poor quality output**: Increase the `scale` option in html2canvas settings
3. **Large file sizes**: Reduce image quality or scale settings
4. **Missing content**: Check for CSS that might hide elements during generation

### Console Debugging

The application logs PDF generation progress to the browser console. Check for error messages if exports fail.

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Note**: This application demonstrates the power of jsPDF's `.html()` method for converting React components to professional PDF documents. Perfect for generating reports, invoices, certificates, and other business documents directly in the browser.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
