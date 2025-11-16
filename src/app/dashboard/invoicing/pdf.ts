import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable directly

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: object) => jsPDF;
  }
}

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

type Business = { 
  id: number; 
  businessName: string; 
  color1: string | null; 
  color2: string | null; 
  color3: string | null; 
  color4: string | null; 
  logoUrl: string | null;
  streetAddress: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  website: string | null;
};

export function generateInvoicePDF(
  client: { name: string; email: string },
  services: { name: string; price: string; description: string | null }[],
  totalAmount: number,
  business: Business,
  dueDate: Date | null,
) {
  console.log("generateInvoicePDF: Function started.");
  console.log("generateInvoicePDF: Inputs - client:", client, "services:", services, "totalAmount:", totalAmount, "business:", business, "dueDate:", dueDate);

  try {
    const doc = new jsPDF();
    autoTable(doc, {}); // Initialize autoTable with the doc instance

    // Add logo
    if (business.logoUrl) {
      console.log("generateInvoicePDF: Attempting to add logo from URL:", business.logoUrl);
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = business.logoUrl;
        // Ensure image is loaded before adding to PDF
        img.onload = () => {
          const imgWidth = 50;
          const imgHeight = (img.height * imgWidth) / img.width;
          doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
          // Continue PDF generation after image is loaded
          addPdfContent(doc, client, services, totalAmount, business, dueDate);
          console.log("generateInvoicePDF: Logo added. Saving PDF.");
          doc.save('invoice.pdf'); // Force download
        };
        img.onerror = (error) => {
          console.error("generateInvoicePDF: Error loading logo image:", error);
          // Continue without logo if it fails to load
          addPdfContent(doc, client, services, totalAmount, business, dueDate);
          console.log("generateInvoicePDF: Logo failed to load. Saving PDF without logo.");
          doc.save('invoice.pdf'); // Force download
        };
      } catch (error) {
        console.error("generateInvoicePDF: Error in logo handling block:", error);
        // Continue without logo if an error occurs in the handling block
        addPdfContent(doc, client, services, totalAmount, business, dueDate);
        console.log("generateInvoicePDF: Error in logo handling. Saving PDF without logo.");
        doc.save('invoice.pdf'); // Force download
      }
    } else {
      console.log("generateInvoicePDF: No logo URL provided. Generating PDF without logo.");
      addPdfContent(doc, client, services, totalAmount, business, dueDate);
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
  services: { name: string; price: string; description: string | null }[],
  totalAmount: number,
  business: Business,
  dueDate: Date | null,
) {
  const colors = {
    color1: business.color1 || '#000000',
    color2: business.color2 || '#000000',
    color3: business.color3 || '#000000',
    color4: business.color4 || '#000000',
  };
  console.log("addPdfContent: colors object:", colors);
  doc.setFont('helvetica'); // Set font to Helvetica

  // Add header
  doc.setFillColor(colors.color1);
  doc.rect(0, 0, 210, 50, 'F');
  doc.setFontSize(22);
  doc.setTextColor('#FFFFFF');
  doc.text('Invoice', 10, 30);

  // Add date
  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.setTextColor('#FFFFFF');
  doc.text(date, 150, 30);

  // Add business info
  doc.setFontSize(12);
  doc.setTextColor('#FFFFFF');
  doc.text(business.businessName, 150, 40);
  doc.text(`${business.streetAddress || ''}`, 150, 45);
  doc.text(`${business.city || ''}, ${business.state || ''} ${business.zipCode || ''}`, 150, 50);
  doc.text(business.website || '', 150, 55);


  // Add client info
  doc.setFontSize(12);
  doc.setTextColor(colors.color2);
  doc.text(`Bill to: ${client.name}`, 10, 70);
  doc.text(`Email: ${client.email}`, 10, 75);

  // Add services table
  const tableData = services.map(service => [service.name, service.description || '', `$${service.price}`]);
  autoTable(doc, { // Use autoTable directly
    startY: 85,
    head: [['Service', 'Description', 'Price']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: colors.color3,
    },
  });

  // Add total
  const tableEndY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.setTextColor(colors.color4);
  doc.text(`Total: $${totalAmount.toFixed(2)}`, 150, tableEndY + 10);

  if (dueDate) {
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text(`To be paid: ${dueDate.toLocaleDateString()}`, 150, tableEndY + 20);
  }

  // Add footer
  doc.setDrawColor(colors.color1);
  doc.line(10, 280, 200, 280);
  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text(`Please remit payment to: ${business.businessName}`, 10, 285);
}
