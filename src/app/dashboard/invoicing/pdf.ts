import jsPDF from 'jspdf';

export function generateInvoicePDF(
  client: { name: string; email: string },
  services: { name: string; price: string }[],
  totalAmount: number,
  logoUrl: string | null
) {
  console.log("generateInvoicePDF: Function started.");
  console.log("generateInvoicePDF: Inputs - client:", client, "services:", services, "totalAmount:", totalAmount, "logoUrl:", logoUrl);

  try {
    const doc = new jsPDF();

    // Add logo
    if (logoUrl) {
      console.log("generateInvoicePDF: Attempting to add logo from URL:", logoUrl);
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = logoUrl;
        // Ensure image is loaded before adding to PDF
        img.onload = () => {
          doc.addImage(img, 'PNG', 10, 10, 50, 20);
          // Continue PDF generation after image is loaded
          addPdfContent(doc, client, services, totalAmount);
          console.log("generateInvoicePDF: Logo added. Saving PDF.");
          doc.save('invoice.pdf'); // Force download
        };
        img.onerror = (error) => {
          console.error("generateInvoicePDF: Error loading logo image:", error);
          // Continue without logo if it fails to load
          addPdfContent(doc, client, services, totalAmount);
          console.log("generateInvoicePDF: Logo failed to load. Saving PDF without logo.");
          doc.save('invoice.pdf'); // Force download
        };
      } catch (error) {
        console.error("generateInvoicePDF: Error in logo handling block:", error);
        // Continue without logo if an error occurs in the handling block
        addPdfContent(doc, client, services, totalAmount);
        console.log("generateInvoicePDF: Error in logo handling. Saving PDF without logo.");
        doc.save('invoice.pdf'); // Force download
      }
    } else {
      console.log("generateInvoicePDF: No logo URL provided. Generating PDF without logo.");
      addPdfContent(doc, client, services, totalAmount);
      console.log("generateInvoicePDF: Saving PDF without logo.");
      doc.save('invoice.pdf'); // Force download
    }
  } catch (error) {
    console.error("generateInvoicePDF: Error during PDF generation:", error);
  }
}

function addPdfContent(
  doc: jsPDF,
  client: { name: string; email: string },
  services: { name: string; price: string }[],
  totalAmount: number
) {
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
}
