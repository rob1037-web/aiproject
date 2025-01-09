import { PDFGenerator } from './pdf/generator.js';
import { debounce } from './utils/helpers.js';

class App {
    constructor() {
        this.pdfGenerator = new PDFGenerator();
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const generateButton = document.getElementById('generatePdf');
        if (generateButton) {
            generateButton.addEventListener('click', this.handleGeneratePDF.bind(this));
        }
    }

    async handleGeneratePDF() {
        try {
            const previewArea = document.getElementById('pdfPreview');
            if (!previewArea) return;

            const pdf = await this.pdfGenerator.generateFromHTML(previewArea);
            this.pdfGenerator.download();
        } catch (error) {
            console.error('Erreur:', error);
            // Ici, vous pourriez ajouter une notification d'erreur à l'utilisateur
        }
    }
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    new App();
});