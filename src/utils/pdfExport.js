import html2pdf from 'html2pdf.js';

export const exportPayslipToPDF = async (elementId, filename = 'สลิปเงินเดือน.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Payslip element not found');
    return;
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2.5, 
      useCORS: true, 
      letterRendering: true,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export failed:', err);
    // Fallback to browser print dialog
    window.print();
  }
};

export const printPayslip = () => {
  window.print();
};
