# AUTOSIGN NightON

## Exemple pratique

```js
const elements = [
    new Image(50, 100,1, 'C:\\B1\\Projet\\test3.png',30,30),
    new Text(50, 25, 2,'Lisarabe',40,30),
    new Text(20,40,1,"testenanana",10,60)

];
const pdfTest = new autoSign('https://www.bouches-du-rhone.gouv.fr/contenu/telechargement/36420/206860/file/SP%20ARLES%20-%20Formulaire%20renouvellement%20titre%20de%20s%C3%9Ajour.pdf', elements);
// On appelle la fonction pour fusionner les éléments avec le PDF
pdfTest.mergeElementsWithPDF()
    .then(async (pdfDoc) => {
        const pdfBytes = await pdfDoc.save();

        // Enregistrez le fichier PDF localement
        fs.writeFileSync('C:\\B1\\Projet\\test.pdf', pdfBytes);

        console.log('Le fichier PDF a été créé avec succès : C:\\B1\\Projet\\test.pdf');
    })
    .catch((error) => {
        console.error('Une erreur est survenue lors de la création du PDF:', error);
    });
```
