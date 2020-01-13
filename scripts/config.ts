import { Range } from 'semver'

export type Feature = {
  id: string // Feature file name/id
  range: Range // Compatible Sketch versions
  name: string // Human readable name
  description: string // Human readable description
}

export const features: Feature[] = [
  {
    id: 'empty',
    range: new Range('*'),
    name: 'Empty',
    description:
      'This is just a bare-bones, empty Sketch document. The equivalent of creating a new document and saving it immediately.',
  },
  {
    id: 'groups',
    range: new Range('*'),
    name: 'Groups',
    description: 'This document demonstrates nested group and layer hierarchy.',
  },
  {
    id: 'images',
    range: new Range('*'),
    name: 'Images',
    description: 'This document contains a bitmap image layer.',
  },
  {
    id: 'library-styles',
    range: new Range('*'),
    name: 'Library styles',
    description:
      'This document contains a shared style imported from a library and applied to a shape on the document',
  },
  {
    id: 'library-symbols',
    range: new Range('*'),
    name: 'Library symbols',
    description: 'This document contains a symbol imported from a library and placed on the page',
  },
  {
    id: 'prototypes',
    range: new Range('*'),
    name: 'Prototypes',
    description: 'This document demonstrates prototypes by creating a link between two artboards.',
  },
  {
    id: 'shape-paths',
    range: new Range('<58.0.0 || >=59.0.0'), // 58 has a bug that means this feature's plugin breaks
    name: 'Shape paths',
    description: 'This document contains a vector shape path layer.',
  },
  {
    id: 'shapes',
    range: new Range('*'),
    name: 'Shapes',
    description: 'This document contains a single styled shape.',
  },
  {
    id: 'symbol-overrides',
    range: new Range('*'),
    name: 'Symbol overrides',
    description: 'This document demonstrates overriding text values in symbols.',
  },
  {
    id: 'symbols',
    range: new Range('*'),
    name: 'Symbols',
    description:
      'This document contains a symbol master and one of its instances, side-by-side on the same page.',
  },
  {
    id: 'text',
    range: new Range('*'),
    name: 'Text',
    description: 'This document contains styled text layers.',
  },
  {
    id: 'smart-layout',
    range: new Range('>=58.0.0'), // Smart layout only available from Sketch 58
    name: 'Smart layout',
    description: 'This document demonstrates symbols using smart layouts.',
  },
  {
    id: 'blur',
    range: new Range('*'),
    name: 'Blur',
    description: 'Applies a blur to a layer',
  },
  {
    id: 'slice',
    range: new Range('*'),
    name: 'Slice',
    description: 'Creates a slice layer',
  },
  {
    id: 'export-formats',
    range: new Range('*'),
    name: 'Export formats',
    description: 'Applies export formats to an artboard',
  },
  {
    id: 'variable-font',
    range: new Range('>=59.0.0'), // Variable fonts only available from Sketch 59
    name: 'Variable font',
    description: 'Sets values on a variable font',
  },
]

export type VersionInfo = {
  document: number // Document version
  sketchVersions: [string, string][] // Tuple [sketchVersion, sketchBuild]
}

export const versions: VersionInfo[] = [
  {
    document: 118,
    sketchVersions: [['55', '78076'], ['55.1', '78136']],
  },
  {
    document: 119,
    sketchVersions: [
      ['55.2', '78181'],
      ['56', '81588'],
      ['56.1', '81669'],
      ['56.2', '81672'],
      ['56.3', '81716'],
      ['57', '83077'],
      ['57.1', '83088'],
    ],
  },
  {
    document: 120,
    sketchVersions: [['58', '84663']],
  },
  {
    document: 121,
    sketchVersions: [['59', '86127'], ['60', '88103'], ['61', '89581']],
  },
]
