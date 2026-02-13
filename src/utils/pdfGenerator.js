import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (assessmentData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Helper function to add text
    const addText = (text, y, fontSize = 12, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont(undefined, isBold ? 'bold' : 'normal');
        doc.text(text, 14, y);
    };

    // Header
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text("SRI SARASWATHI VIDHYALAYA", pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text("Inclusive Education Entry Level Assessment Form", pageWidth / 2, 30, { align: 'center' });

    let currentY = 45;

    // Child Information
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text("Child Information", 14, currentY);
    currentY += 10;

    const childInfo = [
        ["Patient ID", assessmentData.patientId],
        ["Child Name", assessmentData.childName],
        ["Date of Birth", assessmentData.dob],
        ["Age", assessmentData.age],
        ["Gender", assessmentData.gender],
        ["Assessment Date", assessmentData.assessmentDate],
        ["Assessor Name", assessmentData.assessorName]
    ];

    doc.autoTable({
        startY: currentY,
        head: [['Field', 'Value']],
        body: childInfo,
        theme: 'grid',
        headStyles: { fillColor: [66, 133, 244] }, // Google Blue-ish color
        styles: { fontSize: 10 },
        columnStyles: { 0: { fontStyle: 'bold', width: 60 } }
    });

    currentY = doc.lastAutoTable.finalY + 15;

    // Sections
    const sections = [
        { key: 'gross', title: 'Gross Motor Skills' },
        { key: 'fine', title: 'Fine Motor Skills' },
        { key: 'language', title: 'Language Skills' },
        { key: 'communication', title: 'Communication Skills' },
        { key: 'social', title: 'Social Interaction Skills' },
        { key: 'adl', title: 'Activities of Daily Living (ADL)' },
        { key: 'cognitive', title: 'Cognitive Skills' }
    ];

    sections.forEach(section => {
        // Check if we need a new page
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }

        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(section.title, 14, currentY);
        currentY += 5;

        const categoryData = assessmentData[section.key];
        const tableBody = Object.entries(categoryData).map(([key, data]) => {
            // Convert camelCase to Title Case
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return [label, data.value, data.comment || '-'];
        });

        doc.autoTable({
            startY: currentY,
            head: [['Skill', 'Response', 'Comment']],
            body: tableBody,
            theme: 'striped',
            headStyles: { fillColor: [100, 100, 100] },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { width: 80 },
                1: { width: 30 },
                2: { width: 70 }
            }
        });

        currentY = doc.lastAutoTable.finalY + 15;
    });

    // Save the PDF
    const fileName = `Assessment_${assessmentData.childName.replace(/\s+/g, '_')}_${assessmentData.assessmentDate}.pdf`;
    doc.save(fileName);
};
