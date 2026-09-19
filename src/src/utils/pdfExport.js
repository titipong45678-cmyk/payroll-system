import html2pdf from 'html2pdf.js';

export const exportPayslipToPDF = async (elementId, filename = 'สลิปเงินเดือน.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Payslip element not found');
    return;
  }

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { 
      scale: 3, 
      useCORS: true, 
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
      dpi: 300
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error('PDF export failed:', err);
    window.print();
  }
};

export const printPayslip = () => {
  window.print();
};
