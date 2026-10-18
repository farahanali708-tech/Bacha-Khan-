import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { PaperSize } from '../types/receipt';

export const exportReceiptAsPNG = async (elementId: string, filename: string): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    const dataUrl = await toPng(element, {
      pixelRatio: 3, // Ultra-sharp 300+ DPI equivalent
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true, // Prevents CORS SecurityError on remote external fonts like Google Fonts
    });

    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Failed to export PNG:', error);
    return false;
  }
};

export const exportReceiptAsPDF = async (
  elementId: string,
  filename: string,
  paperSize: PaperSize = '80mm'
): Promise<boolean> => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    const dataUrl = await toPng(element, {
      pixelRatio: 3,
      backgroundColor: '#ffffff',
      cacheBust: true,
      skipFonts: true, // Prevents CORS SecurityError on remote external fonts like Google Fonts
    });

    // Create a temporary image to measure rendered pixel dimensions accurately
    const img = new Image();
    img.src = dataUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (e) => reject(e);
    });

    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    let pdf: jsPDF;

    if (paperSize === '80mm') {
      // 80mm thermal receipt roll width, height proportional
      const widthMm = 80;
      const heightMm = (imgHeight * widthMm) / imgWidth;
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm);
    } else if (paperSize === '58mm') {
      // 58mm thermal receipt roll width
      const widthMm = 58;
      const heightMm = (imgHeight * widthMm) / imgWidth;
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [widthMm, heightMm],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, widthMm, heightMm);
    } else {
      // Standard A4
      pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      // Center the receipt on A4 sheet with realistic 85mm receipt width
      const receiptWidthMm = 90;
      const receiptHeightMm = (imgHeight * receiptWidthMm) / imgWidth;
      const xOffset = (210 - receiptWidthMm) / 2;
      const yOffset = 15;
      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, receiptWidthMm, receiptHeightMm);
    }

    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
};
