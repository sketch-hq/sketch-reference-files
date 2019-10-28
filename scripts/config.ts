import { Range, satisfies, coerce } from 'semver'

export type Feature = {
  id: string // Feature file name/id
  range: Range // Compatible Sketch versions
  name: string // Human readable name
  description: string // Human readable description
}

export type ConfigItem = {
  version: string // Target Sketch version
  build: string // Sketch build ref (used for Sketch.app download)
  features: Feature[] // List of feature reference files that should be built
}

export type Config = ConfigItem[]

const features: Feature[] = [
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
    range: new Range('>=58.0.0'), // Smart layout only available after Sketch 58
    name: 'Smart layout',
    description: 'This document demonstrates symbols using smart layouts.',
  },
]

export const config: Config = [
  {
    version: '55',
    build: '78076',
  },
  {
    version: '55.1',
    build: '78136',
  },
  {
    version: '55.2',
    build: '78181',
  },
  {
    version: '56',
    build: '81588',
  },
  {
    version: '56.1',
    build: '81669',
  },
  {
    version: '56.2',
    build: '81672',
  },
  {
    version: '56.3',
    build: '81716',
  },
  {
    version: '57',
    build: '83077',
  },
  {
    version: '57.1',
    build: '83088',
  },
  {
    version: '58',
    build: '84663',
  },
  {
    version: '59',
    build: '86127',
  },
].map(configItem => ({
  ...configItem,
  features: features.filter(refFile => satisfies(coerce(configItem.version) || '', refFile.range)),
}))
