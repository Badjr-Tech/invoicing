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

    const logoWidth = 50;
    const logoHeight = 20; // Adjusted logo height for better fit
    const logoX = 10;
    const logoY = 10;

    // Add logo
    if (business.logoUrl) {
      console.log("generateInvoicePDF: Attempting to add logo from URL:", business.logoUrl);
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = business.logoUrl;
        // Ensure image is loaded before adding to PDF
        img.onload = () => {
          doc.addImage(img, 'PNG', logoX, logoY, logoWidth, logoHeight);
          // Continue PDF generation after image is loaded
          addPdfContent(doc, client, services, totalAmount, business, dueDate, logoY + logoHeight + 5); // Pass logo bottom Y
          console.log("generateInvoicePDF: Logo added. Saving PDF.");
          doc.save('invoice.pdf'); // Force download
        };
        img.onerror = (error) => {
          console.error("generateInvoicePDF: Error loading logo image:", error);
          // Continue without logo if it fails to load
          addPdfContent(doc, client, services, totalAmount, business, dueDate, logoY + logoHeight + 5); // Pass logo bottom Y
          console.log("generateInvoicePDF: Logo failed to load. Saving PDF without logo.");
          doc.save('invoice.pdf'); // Force download
        };
      } catch (error) {
        console.error("generateInvoicePDF: Error in logo handling block:", error);
        // Continue without logo if an error occurs in the handling block
        addPdfContent(doc, client, services, totalAmount, business, dueDate, logoY + logoHeight + 5); // Pass logo bottom Y
        console.log("generateInvoicePDF: Error in logo handling. Saving PDF without logo.");
        doc.save('invoice.pdf'); // Force download
      }
    } else {
      console.log("generateInvoicePDF: No logo URL provided. Generating PDF without logo.");
      addPdfContent(doc, client, services, totalAmount, business, dueDate, logoY); // Pass initial Y if no logo
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
  contentStartAfterLogoY: number, // New parameter for dynamic content start
) {
  const colors = {
    color1: business.color1 || '#000000',
    color2: business.color2 || '#000000',
    color3: business.color3 || '#000000',
    color4: business.color4 || '#000000',
  };
  console.log("addPdfContent: colors object:", colors);
  doc.setFont('Times-Roman'); // Set font to Times-Roman

  const startX = 15;
  const lineHeight = 7;

  const headerBarHeight = 30;
  const headerBarY = contentStartAfterLogoY + 5; // Start bar below logo + some margin

  // Header Background
  doc.setFillColor(colors.color1);
  doc.rect(0, headerBarY, 210, headerBarHeight, 'F');

  // Invoice Title
  doc.setFontSize(28);
  doc.setTextColor('#FFFFFF');
  doc.text('INVOICE', startX, headerBarY + (headerBarHeight / 2) + 5); // Centered vertically in bar

  // Business Info (Top Right, within header bar)
  doc.setFontSize(10);
  doc.setTextColor('#FFFFFF');
  const businessInfoX = 200; // Right align
  let currentY = headerBarY + 5;
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

  // Date (Below Business Info, within header bar)
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setTextColor('#FFFFFF');
  doc.text(`Date: ${date}`, businessInfoX, currentY + 5, { align: 'right' });

  // Client Info (Left, below header bar)
  let contentY = headerBarY + headerBarHeight + 10; // Start content below header bar + margin
  doc.setFontSize(12);
  doc.setTextColor(colors.color2);
  doc.text('Bill To:', startX, contentY);
  contentY += lineHeight;
  doc.setFontSize(14);
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
      font: 'Times-Roman',
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
  const bottomBarHeight = 15;
  const bottomBarGap = 5;
  const bottomBarY = doc.internal.pageSize.height - 20 - bottomBarHeight - bottomBarGap;

  doc.setFillColor(colors.color2);
  doc.rect(0, bottomBarY, 210, bottomBarHeight, 'F');

  doc.setFontSize(10);
  doc.setTextColor('#FFFFFF'); // White text on colored bar
  doc.text('Thank you for your business!', doc.internal.pageSize.width / 2, bottomBarY + (bottomBarHeight / 2) + 2, { align: 'center' });

  const finalFooterLineY = doc.internal.pageSize.height - 20;
  const finalRemitTextY = doc.internal.pageSize.height - 10;

  doc.setDrawColor(colors.color1);
  doc.line(startX, finalFooterLineY, 200, finalFooterLineY); // Horizontal line
  doc.setFontSize(10);
  doc.setTextColor('#000000');
  doc.text(`Please remit payment to: ${business.businessName}`, startX, finalRemitTextY);
}
