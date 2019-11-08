const { Document, Artboard, Rectangle } = require('sketch')

function main(ctx) {
  // Create a new document, and get a reference to its selected page
  const doc = new Document()
  const page = doc.selectedPage

  // Create an artboard
  const artboard = new Artboard({
    name: 'MyArtboard',
    parent: page,
    frame: new Rectangle(0, 0, 200, 200),
    exportFormats: [
      // Formats
      {
        fileFormat: 'jpg',
        size: '2x',
      },
      {
        fileFormat: 'png',
        size: '2x',
      },
      {
        fileFormat: 'tiff',
        size: '2x',
      },
      {
        fileFormat: 'eps',
        size: '2x',
      },
      {
        fileFormat: 'pdf',
        size: '2x',
      },
      {
        fileFormat: 'webp',
        size: '2x',
      },
      {
        fileFormat: 'svg',
        size: '2x',
      },
      // Sizes
      {
        fileFormat: 'jpg',
        size: '100w',
      },
      {
        fileFormat: 'jpg',
        size: '100px',
      },
      {
        fileFormat: 'jpg',
        size: '300h',
      },
      // Suffix/prefix
      {
        fileFormat: 'jpg',
        size: '2x',
        prefix: 'myPrefix',
      },
      {
        fileFormat: 'jpg',
        size: '2x',
        suffix: 'mySuffix',
      },
    ],
  })

  // Save and close
  doc.save(
    `${ctx.savePath}/output.sketch`,
    {
      saveMode: Document.SaveMode.SaveAs,
    },
    function() {
      doc.close()
    },
  )
}
