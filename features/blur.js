/* eslint-disable */

const { Document, Shape, Rectangle, Style } = require('sketch')

function main(ctx) {
  // Create a new document, and get a reference to its selected page
  const doc = new Document()
  const page = doc.selectedPage

  const shape = new Shape({
    name: 'shape',
    parent: page,
    frame: new Rectangle(0, 0, 200, 200),
    style: {
      blur: {
        center: {
          x: 10,
          y: 20,
        },
        type: Style.BlurType.Motion,
        motionAngle: 10,
        radius: 2,
      },
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
    },
  )
}
