import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with header and accessor
 * @param {String} filename - Name of the file to download
 */
export const exportToExcel = (data, columns, filename = 'data.xlsx') => {
  try {
    // Prepare data with column headers
    const headers = columns.map(col => col.header);
    const exportData = data.map(row => {
      const rowData = {};
      columns.forEach(col => {
        rowData[col.header] = row[col.accessor] || '';
      });
      return rowData;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });
    
    // Set column widths
    const columnWidths = columns.map(col => ({
      wch: Math.max(col.header.length, 15)
    }));
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Download file
    XLSX.writeFile(workbook, filename);
    
    return { success: true, message: 'Excel file downloaded successfully' };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, message: 'Failed to export Excel file' };
  }
};

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with header and accessor
 * @param {String} filename - Name of the file to download
 */
export const exportToCSV = (data, columns, filename = 'data.csv') => {
  try {
    // Create CSV header
    const headers = columns.map(col => col.header).join(',');
    
    // Create CSV rows
    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col.accessor] || '';
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',');
    });

    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, message: 'CSV file downloaded successfully' };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, message: 'Failed to export CSV file' };
  }
};

/**
 * Export data to PDF file
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions with header and accessor
 * @param {String} filename - Name of the file to download
 * @param {String} title - Title of the PDF document
 */
export const exportToPDF = (data, columns, filename = 'data.pdf', title = 'Data Export') => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.setTextColor(102, 126, 234);
    doc.text(title, 14, 15);

    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

    // Prepare table data
    const headers = columns.map(col => col.header);
    const rows = data.map(row => {
      return columns.map(col => {
        const value = row[col.accessor];
        // Handle complex render functions by getting plain text
        return typeof value === 'object' ? JSON.stringify(value) : String(value || '');
      });
    });

    // Add table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 28,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { top: 28 },
    });

    // Save PDF
    doc.save(filename);

    return { success: true, message: 'PDF file downloaded successfully' };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, message: 'Failed to export PDF file' };
  }
};

/**
 * Export data in the specified format
 * @param {String} format - Export format: 'excel', 'csv', or 'pdf'
 * @param {Array} data - Array of objects to export
 * @param {Array} columns - Array of column definitions
 * @param {String} filename - Name of the file (without extension)
 * @param {String} title - Title for PDF (optional)
 */
export const exportData = (format, data, columns, filename = 'export', title = 'Data Export') => {
  switch (format) {
    case 'excel':
      return exportToExcel(data, columns, `${filename}.xlsx`);
    case 'csv':
      return exportToCSV(data, columns, `${filename}.csv`);
    case 'pdf':
      return exportToPDF(data, columns, `${filename}.pdf`, title);
    default:
      console.error('Invalid export format:', format);
      return { success: false, message: 'Invalid export format' };
  }
};
