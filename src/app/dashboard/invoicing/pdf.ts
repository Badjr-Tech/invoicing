import jsPDF from 'jspdf';

export function generateInvoicePDF(
  client: { name: string; email: string },
  services: { name: string; price: string }[],
  totalAmount: number,
  logoUrl: string | null
) {
  const doc = new jsPDF();

  // Add logo
  if (logoUrl) {
    // Note: This will only work if the logo is accessible via a public URL
    // and the browser can fetch it without CORS issues.
    // You might need to handle image loading more robustly.
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = logoUrl;
      doc.addImage(img, 'PNG', 10, 10, 50, 20);
    } catch (error) {
      console.error("Error adding logo to PDF:", error);
    }
  }

  // Add header
  doc.setFontSize(22);
  doc.text('Invoice', 10, 40);

  // Add client info
  doc.setFontSize(12);
  doc.text(`Bill to: ${client.name}`, 10, 60);
  doc.text(`Email: ${client.email}`, 10, 65);

  // Add services table
  let y = 80;
  doc.setFontSize(14);
  doc.text('Services', 10, y);
  y += 10;
  doc.setFontSize(12);
  services.forEach(service => {
    doc.text(`${service.name}`, 10, y);
    doc.text(`$${service.price}`, 150, y);
    y += 7;
  });

  // Add total
  doc.setFontSize(14);
  doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, y + 10);

  // Open the PDF in a new tab
  doc.output('dataurlnewwindow');
}
