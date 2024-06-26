const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
class autoSign { //Ma calsse qui me permet de fusionner des élements avec un pdf
    constructor(pdfPath, elements) {
        this.pdfPath = pdfPath;// url de mon fichier PDF
        this.elements = elements; // Liste des objets (images ou texte)
    }

    async mergeElementsWithPDF() {
        try {
            //charger le pdf depuis this.pdfPath
            let pdfDoc = await fetch(this.pdfPath).then((res) => res.arrayBuffer());
            pdfDoc = await PDFDocument.load(pdfDoc);
            //fusionner les elements
            for (const element of this.elements) {
                await element.mergeWithPDF(pdfDoc);
            }
            return pdfDoc;
        } catch (error) {
            console.error('Une erreur est survenue lors de la fusion des éléments avec le PDF:', error);
            throw error;
        }
    }
}
//Mon element Image
class Image {
    constructor(x, y, pageNumber, imagePath, maxHeight, maxWidth) {
        this.x = x;
        this.y = y;
        this.imagePath = imagePath;
        this.pageNumber = pageNumber;
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
    }

    async mergeWithPDF(pdfDoc) {
        try {
            const imageBytes = fs.readFileSync(this.imagePath);
            const image = await pdfDoc.embedPng(imageBytes);
            const page = pdfDoc.getPages()[this.pageNumber - 1]; //pour récuperer l'image spécifié

            // ajuster la taille de l'image
            let temp=1
            if (image.width > this.maxWidth || image.height > this.maxHeight) {
                temp=Math.min(this.maxWidth/image.width,this.maxHeight/image.height)
            }

            page.drawImage(image, {
                x: this.x,
                y: this.y,
                width:image.width*temp,
                height:image.height*temp,
            });
        } catch (error) {
            console.error('Une erreur est survenue lors de la fusion de l\'image :', error);
            throw error;
        }
    }
}
//Classe représente l'élément texte
class Text {
    constructor(x, y, pageNumber, content, maxHeight, maxWidth) {
        this.x = x;
        this.y = y;
        this.content = content;
        this.pageNumber = pageNumber;
        this.maxHeight = maxHeight;
        this.maxWidth = maxWidth;
    }

    async mergeWithPDF(pdfDoc) {
        try {
            const page = pdfDoc.getPages()[this.pageNumber - 1];
            let fontSize = 12; // Taille de police initiale

            // Mesurer la largeur du texte avec la police actuelle
            let textWidth = page.drawText(this.content, {
                x: this.x,
                y: this.y,
                size: fontSize,
            });

            let textHeight = fontSize; // La hauteur dépend de la taille de la police

            // Tant que le texte dépasse les dimensions maximales, réduire la taille de la police
            while (textWidth > this.maxWidth || textHeight > this.maxHeight) {
                fontSize -= 1; // Diminuer la taille de police

                // Mesurer la largeur du texte avec la nouvelle taille de police
                textWidth = page.drawText(this.content, {
                    x: this.x,
                    y: this.y,
                    size: fontSize,
                });

                textHeight = fontSize; // La hauteur dépend de la taille de la police
            }

            // Dessiner le texte avec la taille de police ajustée
            page.drawText(this.content, {
                x: this.x,
                y: this.y,
                size: fontSize,
            });
        } catch (error) {
            console.error('Une erreur est survenue lors de la fusion du texte :', error);
            throw error;
        }
    }
}