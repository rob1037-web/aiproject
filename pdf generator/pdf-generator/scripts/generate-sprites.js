const SVGSpriter = require('svg-sprite');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const config = require('../config/sprite.config.js');

async function generateSprites() {
  const spriter = new SVGSpriter(config.spritesheetConfig);
  
  // Récupération des fichiers SVG
  const svgFiles = glob.sync(config.src.glob, { cwd: config.src.cwd });

  // Ajout des fichiers au spriter
  svgFiles.forEach(filePath => {
    const fullPath = path.join(config.src.cwd, filePath);
    const svgContent = fs.readFileSync(fullPath, 'utf8');
    spriter.add(fullPath, null, svgContent);
  });

  // Compilation du sprite
  spriter.compile((error, result) => {
    if (error) {
      console.error('Erreur lors de la génération du sprite:', error);
      return;
    }

    // Création du dossier de destination si nécessaire
    const targetDir = path.dirname(config.target.image);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Écriture du fichier sprite
    for (const type in result.symbol) {
      fs.writeFileSync(config.target.image, result.symbol[type].contents);
    }

    console.log('Sprite SVG généré avec succès !');
  });
}

generateSprites().catch(console.error);