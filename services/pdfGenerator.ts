
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TrackingSession } from '../types';
import html2canvas from 'html2canvas';

// Extend the jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
      autoTable: (options: any) => jsPDF;
    }
}

export const generatePdf = async (session: TrackingSession) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 15; // vertical cursor

    // Title
    doc.setFontSize(22);
    doc.text(session.name, 14, y);
    y += 10;

    // Subtitle - Date
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Date: ${new Date(session.startTime).toLocaleString()}`, 14, y);
    y += 15;

    // Summary Stats
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Session Summary', 14, y);
    y += 7;
    
    const summaryData = [
        ['Distance:', `${session.distance.toFixed(2)} km`],
        ['Duration:', `${Math.round((session.endTime - session.startTime) / 60000)} minutes`],
        ['Avg Speed:', `${(session.distance / ((session.endTime - session.startTime) / 3600000)).toFixed(2)} km/h`],
        ['Area Covered:', `${(session.area * 1000000).toFixed(1)} m²`],
    ];
    doc.autoTable({
        startY: y,
        body: summaryData,
        theme: 'plain',
        styles: { fontSize: 10 },
        tableWidth: 'auto',
        margin: { left: 14 }
    });
    y = (doc as any).lastAutoTable.finalY + 15;

    // Map Screenshot
    const mapElement = document.querySelector<HTMLElement>('.map-container');
    if (mapElement) {
        try {
            const canvas = await html2canvas(mapElement, {
                useCORS: true, // Important for Google Maps tiles
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = doc.internal.pageSize.getWidth() - 28;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            if (y + pdfHeight > pageHeight - 20) {
                doc.addPage();
                y = 15;
            }

            doc.text('Route Map', 14, y);
            y += 7;
            doc.addImage(imgData, 'PNG', 14, y, pdfWidth, pdfHeight);
            y += pdfHeight + 10;
        } catch (error) {
            console.error("Error capturing map:", error);
            doc.text('Could not capture map image.', 14, y);
            y += 10;
        }
    }


    // Data Table
    if (y > pageHeight - 40) { // Check if there's enough space for the table header
        doc.addPage();
        y = 15;
    }
    doc.text('Detailed Log', 14, y);
    y += 7;

    const tableColumn = ["Timestamp", "Latitude", "Longitude", "Speed (km/h)"];
    const tableRows = session.path.map(p => [
        new Date(p.timestamp).toLocaleTimeString(),
        p.lat.toFixed(6),
        p.lng.toFixed(6),
        p.speed ? p.speed.toFixed(1) : 'N/A'
    ]);

    doc.autoTable({
        startY: y,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [29, 78, 216] }, // Blue-700
    });
    
    // Save PDF
    doc.save(`${session.name.replace(/\s+/g, '_')}_${new Date(session.startTime).toISOString().split('T')[0]}.pdf`);
};
