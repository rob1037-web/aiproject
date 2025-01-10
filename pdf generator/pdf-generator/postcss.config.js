module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'ie >= 11',
        'Firefox ESR',
        'not dead'
      ]
    }),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: false,
        minifyFontValues: {
          removeQuotes: false
        },
        colormin: {
          legacy: true
        },
        zindex: false,
        reduceIdents: false,
        mergeIdents: false,
        discardUnused: false,
        cssDeclarationSorter: false,
        calc: true,
        mergeLonghand: true,
        mergeRules: true,
        minifyParams: true,
        minifySelectors: true,
        normalizeCharset: true,
        normalizeDisplayValues: true,
        normalizePositions: true,
        normalizeRepeatStyle: true,
        normalizeString: true,
        normalizeTimingFunctions: true,
        normalizeUnicode: true,
        normalizeUrl: true,
        orderedValues: true,
        reduceInitial: true,
        reduceTransforms: true,
        uniqueSelectors: true
      }]
    }),
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
        'color-function': true, // Remplacé color-mod-function par color-function
        'gap-properties': true
      }
    }),
    require('postcss-combine-media-query'),
    require('postcss-custom-properties')({
      preserve: false
    })
  ],
  map: {
    inline: false,
    annotation: true,
    sourcesContent: true
  }
};