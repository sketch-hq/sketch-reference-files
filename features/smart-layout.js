// TODO: Use SketchAPI to do this when ready

var sketch = require('sketch')
var Document = require('sketch').Document
var Rectangle = require('sketch/dom').Rectangle
var Shape = require('sketch/dom').Shape
var SymbolMaster = require('sketch/dom').SymbolMaster
var SymbolInstance = require('sketch/dom').SymbolInstance
var Text = require('sketch/dom').Text
var Artboard = require('sketch/dom').Artboard
var Page = require('sketch/dom').Page

function main(ctx) {
  const doc = new Document()
  const page = doc.selectedPage

  var artboard = new Artboard({
    parent: page,
    name: 'artboard',
    frame: { x: 0, y: 0, width: 100, height: 32 },
  })

  const newLayout = MSInferredGroupLayout.alloc().init()
  newLayout.isInferredLayout = true
  newLayout.axis = 0
  newLayout.layoutAnchor = 1

  var rect = new Rectangle(0, 0, 100, 32)

  var rectShape = new Shape({
    name: 'rectShape',
    parent: artboard,
    frame: rect,
    style: {
      fills: ['#4A90E2'],
    },
  })

  var textItem = new Text({
    parent: rectShape,
    text: 'Hello',
    name: 'textItem',
    fixedWidth: 0,
    style: {
      textColor: '#FFFFFF',
    },
    frame: { x: 10, y: 8, width: 80, height: 16 },
  })

  var symbols = new Page({
    name: 'Symbols',
    parent: doc,
  })

  var master = SymbolMaster.fromArtboard(artboard)
  master.parent = symbols
  master.sketchObject.groupLayout = newLayout

  var instance1 = new SymbolInstance({
    name: 'instance',
    symbolId: master.symbolId,
    parent: page,
  })
  instance1.frame = { x: 0, y: 100, width: 100, height: 32 }
  instance1.setOverrideValue(instance1.overrides[0], 'My really long text goes here')
  instance1.sketchObject.resizeToFitContentsIfNeededNoCache()

  var instance2 = new SymbolInstance({
    name: 'instance',
    symbolId: master.symbolId,
    parent: page,
  })
  instance2.frame = { x: 0, y: 300, width: 100, height: 32 }
  instance2.setOverrideValue(instance2.overrides[0], 'My other text should go here something')
  instance2.sketchObject.resizeToFitContentsIfNeededNoCache()

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
