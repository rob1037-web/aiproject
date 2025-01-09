const path = require('path');

module.exports = {
  src: {
    cwd: path.resolve(__dirname, '../src/assets/img/icons'),
    glob: '**/*.svg'
  },
  target: {
    image: path.resolve(__dirname, '../src/assets/sprites/sprite.svg'),
    css: path.resolve(__dirname, '../src/styles/sprites.css')
  },
  spritesheetConfig: {
    mode: {
      symbol: {
        dest: '../sprites',
        sprite: 'sprite.svg',
        example: false
      }
    },
    shape: {
      transform: [
        {
          svgo: {
            plugins: [
              { removeTitle: true },
              { removeDesc: true },
              { removeUselessDefs: true },
              { removeXMLNS: true },
              { removeViewBox: false },
              { removeDimensions: true },
              { cleanupIDs: true }
            ]
          }
        }
      ]
    },
    svg: {
      xmlDeclaration: false,
      doctypeDeclaration: false
    }
  }
};