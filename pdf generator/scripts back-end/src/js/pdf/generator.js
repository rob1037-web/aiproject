import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { formatDate } from '../utils/helpers.js';

export class PDFGenerator {
    constructor() {
        this.pdf = new jsPDF();
    }

    async generateFromHTML(element) {
        try {
            const canvas = await html2canvas(element);
            const imgData = canvas.toDataURL('image/png');
            
            // Configuration du PDF
            this.pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            
            // Ajout des métadonnées
            this.pdf.setProperties({
                title: Document généré le ${formatDate(new Date())},
                subject: 'PDF Generator',
                author: 'PDF Generator App',
                keywords: 'pdf, generator',
                creator: 'PDF Generator App'
            });

            return this.pdf;
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            throw error;
        }
    }

    download(filename = 'document.pdf') {
        this.pdf.save(filename);
    }
}
