const { Document, Artboard, Shape, Rectangle, Style, Text, Slice } = require('sketch')

function main(ctx) {
  // Create a new document, and get a reference to its selected page
  const doc = new Document()
  const page = doc.selectedPage

  // Create an artboard
  const artboard = new Artboard({
    name: 'MyArtboard',
    parent: page,
    frame: new Rectangle(0, 0, 200, 200),
  })

  // Nest a slice within the artboard
  var slice = new Slice({
    name: 'MySlice',
    parent: artboard,
    frame: new Rectangle(0, 0, 200, 200),
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
