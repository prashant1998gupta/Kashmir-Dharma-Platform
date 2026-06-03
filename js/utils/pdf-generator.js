/* ============================================
   PDF Generator Utility
   Uses jsPDF + html2canvas for branded PDF export
   ============================================ */

const PDFGenerator = (() => {

    /**
     * Generate a professional PDF from a report container element
     * @param {string} containerId - The ID of the HTML element containing the report
     * @param {string} fileName - Output PDF file name
     * @param {string} reportTitle - Title shown in PDF metadata
     */
    async function generatePDF(containerId, fileName, reportTitle) {
        if (typeof jspdf === 'undefined' || typeof html2canvas === 'undefined') {
            Components.showToast('PDF library loading... Please try again in a moment.', 'error');
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) {
            Components.showToast('Report not found. Please generate the report first.', 'error');
            return;
        }

        // Show loading toast
        Components.showToast('Generating PDF... Please wait.', 'info');

        try {
            // Temporarily apply print-friendly styles
            container.classList.add('pdf-rendering');
            document.body.classList.add('pdf-export-mode');

            // Wait for styles to apply
            await new Promise(r => setTimeout(r, 200));

            const { jsPDF } = jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const contentWidth = pageWidth - (margin * 2);

            // Find all report sections
            const sections = container.querySelectorAll('.report-section, .print-page-break + *');
            
            // If no sections found, capture the entire container
            const elements = sections.length > 0 ? 
                Array.from(container.children).filter(el => el.offsetHeight > 0) : [container];

            let isFirstPage = true;

            for (let i = 0; i < elements.length; i++) {
                const el = elements[i];
                
                // Skip empty elements and page breaks
                if (el.classList.contains('print-page-break') || el.classList.contains('no-print') || el.offsetHeight < 5) continue;

                const canvas = await html2canvas(el, {
                    scale: 2,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#FFFFFF',
                    windowWidth: 800,
                    onclone: (clonedDoc) => {
                        // Force white background on cloned elements
                        const clonedEl = clonedDoc.getElementById(el.id) || clonedDoc.body;
                        clonedEl.style.background = '#FFFFFF';
                        clonedEl.style.color = '#1a1a1a';
                        // Force all text to be dark
                        clonedEl.querySelectorAll('*').forEach(child => {
                            child.style.color = child.style.color || '#1a1a1a';
                        });
                    }
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.92);
                const imgWidth = contentWidth;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                // If image is taller than one page, split it
                let yPos = margin;
                let remainingHeight = imgHeight;
                let sourceY = 0;

                while (remainingHeight > 0) {
                    if (!isFirstPage) {
                        pdf.addPage();
                    }
                    isFirstPage = false;

                    const availableHeight = pageHeight - (margin * 2);
                    const sliceHeight = Math.min(remainingHeight, availableHeight);

                    // Calculate source coordinates for slicing
                    const sourceSliceHeight = (sliceHeight / imgHeight) * canvas.height;
                    
                    // Create a temp canvas for the slice
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = sourceSliceHeight;
                    const ctx = tempCanvas.getContext('2d');
                    ctx.drawImage(canvas, 0, sourceY, canvas.width, sourceSliceHeight, 0, 0, canvas.width, sourceSliceHeight);

                    const sliceData = tempCanvas.toDataURL('image/jpeg', 0.92);
                    pdf.addImage(sliceData, 'JPEG', margin, margin, imgWidth, sliceHeight);

                    // Add footer
                    pdf.setFontSize(8);
                    pdf.setTextColor(150, 150, 150);
                    pdf.text('Kashmir Dharma Companion — Preserving Heritage Through Technology', pageWidth / 2, pageHeight - 5, { align: 'center' });

                    sourceY += sourceSliceHeight;
                    remainingHeight -= sliceHeight;
                }
            }

            // Set PDF metadata
            pdf.setProperties({
                title: reportTitle,
                subject: 'Vedic Astrology Report',
                author: 'Kashmir Dharma Companion',
                creator: 'Kashmir Dharma Companion'
            });

            // Save
            pdf.save(fileName);
            Components.showToast('PDF downloaded successfully!', 'success');

        } catch (e) {
            console.error('PDF generation error:', e);
            Components.showToast('PDF generation failed. Try Print/Save as PDF instead.', 'error');
        } finally {
            container.classList.remove('pdf-rendering');
            document.body.classList.remove('pdf-export-mode');
        }
    }

    /**
     * Simple branded PDF using text-only (no html2canvas dependency)
     * Faster and more reliable for structured data
     */
    function generateTextPDF(reportData, fileName) {
        if (typeof jspdf === 'undefined') {
            Components.showToast('PDF library loading...', 'error');
            return;
        }

        const { jsPDF } = jspdf;
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 15;
        const maxWidth = pageWidth - margin * 2;
        let y = margin;

        function checkPageBreak(neededHeight) {
            if (y + neededHeight > pageHeight - 20) {
                addFooter();
                pdf.addPage();
                y = margin;
                return true;
            }
            return false;
        }

        function addFooter() {
            pdf.setFontSize(7);
            pdf.setTextColor(150);
            pdf.text('Kashmir Dharma Companion — Preserving Heritage Through Technology', pageWidth / 2, pageHeight - 5, { align: 'center' });
            const pageNum = pdf.getNumberOfPages();
            pdf.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 5, { align: 'right' });
        }

        function addTitle(text, fontSize, color) {
            checkPageBreak(fontSize * 0.5 + 5);
            pdf.setFontSize(fontSize);
            pdf.setTextColor(color[0], color[1], color[2]);
            pdf.setFont('helvetica', 'bold');
            pdf.text(text, pageWidth / 2, y, { align: 'center' });
            y += fontSize * 0.5 + 2;
        }

        function addSectionHeader(text) {
            checkPageBreak(15);
            y += 5;
            pdf.setDrawColor(201, 169, 89);
            pdf.setLineWidth(0.5);
            pdf.line(margin, y, pageWidth - margin, y);
            y += 5;
            pdf.setFontSize(13);
            pdf.setTextColor(51, 51, 51);
            pdf.setFont('helvetica', 'bold');
            pdf.text(text, margin, y);
            y += 8;
        }

        function addParagraph(text, options = {}) {
            const fontSize = options.fontSize || 10;
            const color = options.color || [51, 51, 51];
            pdf.setFontSize(fontSize);
            pdf.setTextColor(color[0], color[1], color[2]);
            pdf.setFont('helvetica', options.bold ? 'bold' : 'normal');
            const lines = pdf.splitTextToSize(text, maxWidth);
            lines.forEach(line => {
                checkPageBreak(fontSize * 0.4 + 1);
                pdf.text(line, options.x || margin, y);
                y += fontSize * 0.4 + 1;
            });
            y += 2;
        }

        function addKeyValue(key, value) {
            checkPageBreak(8);
            pdf.setFontSize(9);
            pdf.setTextColor(120);
            pdf.setFont('helvetica', 'normal');
            pdf.text(key, margin, y);
            pdf.setTextColor(30);
            pdf.setFont('helvetica', 'bold');
            pdf.text(value, margin + 55, y);
            y += 5;
        }

        function addTable(headers, rows) {
            const colWidth = maxWidth / headers.length;
            checkPageBreak(15);
            
            // Header row
            pdf.setFillColor(245, 240, 224);
            pdf.rect(margin, y - 4, maxWidth, 7, 'F');
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(51);
            headers.forEach((h, i) => {
                pdf.text(h, margin + (i * colWidth) + 2, y);
            });
            y += 5;

            // Data rows
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            rows.forEach((row, ri) => {
                checkPageBreak(6);
                if (ri % 2 === 0) {
                    pdf.setFillColor(250, 250, 250);
                    pdf.rect(margin, y - 3.5, maxWidth, 5, 'F');
                }
                pdf.setTextColor(30);
                row.forEach((cell, ci) => {
                    pdf.text(String(cell).substring(0, 25), margin + (ci * colWidth) + 2, y);
                });
                y += 5;
            });
            y += 3;
        }

        // Build the report
        reportData.sections.forEach(section => {
            switch(section.type) {
                case 'header':
                    addTitle('Kashmir Dharma Companion', 10, [201, 169, 89]);
                    addTitle(section.title, 18, [30, 30, 30]);
                    if (section.subtitle) addTitle(section.subtitle, 12, [80, 80, 80]);
                    if (section.date) {
                        pdf.setFontSize(9);
                        pdf.setTextColor(130);
                        pdf.setFont('helvetica', 'normal');
                        pdf.text(section.date, pageWidth / 2, y, { align: 'center' });
                        y += 8;
                    }
                    pdf.setDrawColor(201, 169, 89);
                    pdf.setLineWidth(1);
                    pdf.line(margin + 40, y, pageWidth - margin - 40, y);
                    y += 10;
                    break;

                case 'section':
                    addSectionHeader(section.title);
                    break;

                case 'text':
                    addParagraph(section.content, section.options || {});
                    break;

                case 'keyvalue':
                    section.items.forEach(item => addKeyValue(item.key, item.value));
                    y += 3;
                    break;

                case 'table':
                    addTable(section.headers, section.rows);
                    break;

                case 'score':
                    checkPageBreak(30);
                    // Draw a circular score indicator
                    const cx = pageWidth / 2;
                    pdf.setDrawColor(201, 169, 89);
                    pdf.setLineWidth(1.5);
                    pdf.circle(cx, y + 12, 12);
                    pdf.setFontSize(20);
                    pdf.setTextColor(30);
                    pdf.setFont('helvetica', 'bold');
                    pdf.text(String(section.score), cx, y + 14, { align: 'center' });
                    pdf.setFontSize(8);
                    pdf.setTextColor(120);
                    pdf.setFont('helvetica', 'normal');
                    pdf.text(`Out of ${section.max}`, cx, y + 19, { align: 'center' });
                    y += 28;
                    if (section.verdict) {
                        pdf.setFontSize(14);
                        pdf.setTextColor(section.verdictColor[0], section.verdictColor[1], section.verdictColor[2]);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(section.verdict, cx, y, { align: 'center' });
                        y += 10;
                    }
                    break;

                case 'pagebreak':
                    addFooter();
                    pdf.addPage();
                    y = margin;
                    break;

                case 'disclaimer':
                    addSectionHeader('Disclaimer & Notes');
                    section.items.forEach((text, i) => {
                        addParagraph(`${i + 1}. ${text}`, { fontSize: 8, color: [100, 100, 100] });
                    });
                    y += 5;
                    pdf.setDrawColor(201, 169, 89);
                    pdf.line(margin + 30, y, pageWidth - margin - 30, y);
                    y += 5;
                    addTitle('Kashmir Dharma Companion', 10, [201, 169, 89]);
                    addParagraph('Preserving Kashmiri Pandit Heritage Through Technology', { fontSize: 8, color: [120, 120, 120] });
                    break;
            }
        });

        addFooter();
        pdf.save(fileName);
        Components.showToast('PDF downloaded successfully!', 'success');
    }

    return { generatePDF, generateTextPDF };
})();
