import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // ══ BRANDING ══
        doc.setFillColor(249, 115, 22); // Orange-500
        doc.rect(0, 0, pageWidth, 40, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('ChatoriApp', 20, 25);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('PREMIUM FOOD DELIVERY EXPERIENCE', 20, 32);

        // ══ INVOICE INFO ══
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('INVOICE', pageWidth - 20, 25, { align: 'right' });

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(`Order ID: #${order._id.slice(-8).toUpperCase()}`, pageWidth - 20, 32, { align: 'right' });

        // ══ DETAILS SECTION ══
        let y = 55;
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('BILL TO:', 20, y);

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(11);
        doc.text(order.deliveryAddress || 'N/A', 20, y + 7, { maxWidth: 80 });

        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('ORDER DETAILS:', pageWidth - 80, y);

        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - 80, y + 7);
        doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`, pageWidth - 80, y + 12);
        if (order.razorpayPaymentId) {
            doc.text(`Transaction: ${order.razorpayPaymentId}`, pageWidth - 80, y + 17);
        }

        // ══ TABLE ══
        y += 40;
        autoTable(doc, {
            startY: y,
            head: [['Item Name', 'Price', 'Qty', 'Total']],
            body: order.items.map(item => [
                item.name,
                `INR ${item.price.toFixed(2)}`,
                item.quantity,
                `INR ${(item.price * item.quantity).toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [249, 115, 22], textColor: [255, 255, 255], fontStyle: 'bold' },
            styles: { fontSize: 10, cellPadding: 5 },
            columnStyles: {
                0: { cellWidth: 85 },
                1: { halign: 'right' },
                2: { halign: 'center' },
                3: { halign: 'right' }
            }
        });

        // ══ TOTALS ══
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Grand Total: INR ${order.totalAmount.toFixed(2)}`, pageWidth - 20, finalY, { align: 'right' });

        // ══ FOOTER ══
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for choosing ChatoriApp! Bon Appétit!', pageWidth / 2, pageHeight - 15, { align: 'center' });

        // SAVE
        doc.save(`ChatoriApp_Invoice_${order._id.slice(-8).toUpperCase()}.pdf`);
    } catch (error) {
        console.error('Invoice Generation Error:', error);
        alert('Failed to generate invoice. Please try again.');
    }
};
