/* eslint-disable */

// Note: Requires https://github.com/arrowtype/recursive font to be installed

// TODO: Use SketchAPI to do this when ready

const { Document, Rectangle, Text, Style } = require('sketch')

class VFont {
  constructor(name) {
    this.font = NSFont.fontWithName_size(name, 28)
  }

  getAxes() {
    const axisArray = this.font.variableFontAxes()
    return axisArray
  }

  getAxisNamed(name) {
    const axes = this.getAxes()
    for (var i = 0; i < axes.length; i++) {
      if (axes[i].name() == name) {
        return axes[i]
      }
    }
    return null
  }
  getValueForAxisByName(name) {
    var axis = this.getAxisNamed(name)
    return axis.currentValue()
  }

  setValueForAxisByName(value, name) {
    var identifier = this.getAxisNamed(name).identifier()
    var subDic  = [NSMutableDictionary dictionary]
    [subDic setObject: value forKey: identifier]
    var dic  = [NSMutableDictionary dictionary]
    [dic setObject: subDic forKey: "NSCTFontVariationAttribute"]
    // Get current font descriptor
    const fontDesc = this.font.fontDescriptor()
    // Add attributes
    const newFontDesc = fontDesc.fontDescriptorByAddingAttributes(dic)
    this.font = NSFont.fontWithDescriptor_size(newFontDesc, 28)
  }
}

function main(ctx) {
  // Create a new document, and get a reference to its selected page
  const doc = new Document()
  const page = doc.selectedPage

  // Create and style two text layers
  const text = new Text({
    text: 'Text',
    parent: page,
    style: {
      textColor: '#000',
    },
  })

  const vfont = new VFont('RecursiveBeta_1_019-SansLinearA_Sans-Casual-Medium-Italic')

  const allAxes = vfont.getAxes()
  const firstAxisName = allAxes[0].name()
  const secondAxisName = allAxes[1].name()

  const current = vfont.getValueForAxisByName(firstAxisName)

  vfont.setValueForAxisByName(0.6, firstAxisName)
  vfont.setValueForAxisByName(0.2, secondAxisName)

  text.sketchObject.setFont(vfont.font)

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
