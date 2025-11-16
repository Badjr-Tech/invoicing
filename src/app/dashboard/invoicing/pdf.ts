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

  const startX = 15;
  const startY = 15;
  const lineHeight = 7;

  // Header Background
  doc.setFillColor(colors.color1);
  doc.rect(0, 0, 210, 40, 'F'); // Adjusted height for header

  // Invoice Title
  doc.setFontSize(28); // Larger font size for title
  doc.setTextColor('#FFFFFF');
  doc.text('INVOICE', startX, startY + 10);

  // Business Info (Top Right)
  doc.setFontSize(10);
  doc.setTextColor('#FFFFFF');
  const businessInfoX = 200; // Right align
  let currentY = startY + 5;
  doc.text(business.businessName, businessInfoX, currentY, { align: 'right' });
  currentY += lineHeight;
  if (business.streetAddress) {
    doc.text(business.streetAddress, businessInfoX, currentY, { align: 'right' });
    currentY += lineHeight;
  }
  if (business.city && business.state && business.zipCode) {
    doc.text(`${business.city}, ${business.state} ${business.zipCode}`, businessInfoX, currentY, { align: 'right' });
    currentY += lineHeight;
  }
  if (business.website) {
    doc.text(business.website, businessInfoX, currentY, { align: 'right' });
    currentY += lineHeight;
  }

  // Date (Below Business Info)
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setTextColor('#FFFFFF');
  doc.text(`Date: ${date}`, businessInfoX, currentY + 5, { align: 'right' }); // Add some space

  // Client Info (Left, below header)
  let contentY = 60; // Starting Y for main content
  doc.setFontSize(12);
  doc.setTextColor(colors.color2);
  doc.text('Bill To:', startX, contentY);
  contentY += lineHeight;
  doc.setFontSize(14); // Slightly larger for client name
  doc.text(client.name, startX, contentY);
  contentY += lineHeight;
  doc.setFontSize(12);
  doc.text(client.email, startX, contentY);
  contentY += (lineHeight * 2); // Extra space before table

  // Add services table
  const tableData = services.map(service => [service.name, service.description || '', `$${service.price}`]);
  autoTable(doc, {
    startY: contentY,
    head: [['Service', 'Description', 'Price']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: colors.color3,
      textColor: '#FFFFFF',
      fontStyle: 'bold',
    },
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 3,
      lineColor: '#CCCCCC',
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: 60 }, // Service Name
      1: { cellWidth: 'auto' }, // Description
      2: { cellWidth: 30, halign: 'right' }, // Price
    },
    didDrawPage: (data) => {
      // Footer on each page
      doc.setFontSize(8);
      doc.setTextColor('#AAAAAA');
      doc.text(`Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`, 10, doc.internal.pageSize.height - 10);
    }
  });

  // Add total and due date
  const tableEndY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY;
  let finalY = tableEndY + 10;

  doc.setFontSize(14);
  doc.setTextColor(colors.color4);
  doc.text(`Total: $${totalAmount.toFixed(2)}`, businessInfoX, finalY, { align: 'right' });
  finalY += lineHeight;

  if (dueDate) {
    doc.setFontSize(12);
    doc.setTextColor('#000000');
    doc.text(`Due Date: ${dueDate.toLocaleDateString()}`, businessInfoX, finalY, { align: 'right' });
    finalY += lineHeight;
  }

  // Add footer
  doc.setDrawColor(colors.color1);
  doc.line(startX, doc.internal.pageSize.height - 20, 200, doc.internal.pageSize.height - 20); // Horizontal line
  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text(`Please remit payment to: ${business.businessName}`, startX, doc.internal.pageSize.height - 10);
}
