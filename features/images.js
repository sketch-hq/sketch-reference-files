/* eslint-disable */

const { Document, Shape, Rectangle, Style, Image } = require('sketch')

function main(ctx) {
  // Create a new document, and get a reference to its selected page
  const doc = new Document()
  const page = doc.selectedPage

  // Add a bitmap image to the page
  const image = new Image({
    name: 'MyImage',
    parent: page,
    frame: new Rectangle(0, 0, 200, 181),
    image: {
      base64:
        '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',
    },
  })

  // Save and close
  doc.save(
    `${ctx.savePath}/output.sketch`,
    {
      saveMode: Document.SaveMode.SaveAs,
    },
    function() {
      doc.close()
    }
  )
}
