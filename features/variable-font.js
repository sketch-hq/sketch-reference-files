// Note: Requires https://github.com/arrowtype/recursive v1.022 font to be
// installed, file generation will error out without it

const { Document, Rectangle, Text, Style } = require('sketch')

function main(ctx) {
  // Create a new document, and get a reference to its selected page
  const doc = new Document()
  const page = doc.selectedPage

  // Create and style a text layer
  const text = new Text({
    text: 'Text',
    parent: page,
    style: {
      fontFamily: 'RecursiveBeta_1_022-SansLinearA_Sans-Casual-Light'
    },
  })

  const axes = text.style.fontAxes
  axes.Weight.value = axes.Weight.max
  text.style.fontAxes = axes

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
