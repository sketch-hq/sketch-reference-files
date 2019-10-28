/**
 * Npm module entrypoint, built into `dist`.
 *
 * Uses the Webpack `require.context` API to bundle all reference file JSON.
 * @see https://webpack.js.org/guides/dependency-management/#context-module-api
 */

import { config, ConfigItem, Feature } from './scripts/config'

const refFileJsonModules = require.context('./files', true, /\.json$/)

export type ReferenceFile = {
  id: string
  name: string
  description: string
  data: {
    document: any
    meta: any
    user: any
    pages: any[]
  }
}

export type ReferenceFiles = {
  [sketchVersion: string]: ReferenceFile[]
}

const files: ReferenceFiles = {}

refFileJsonModules.keys().forEach(filepath => {
  const [, version, featureId, ...rest] = filepath.split('/')
  const configItem: ConfigItem | undefined = config.find(item => item.version === version)
  if (!configItem) return
  const feature: Feature | undefined = configItem.features.find(feature => feature.id === featureId)
  if (!feature) return
  if (!files[version]) {
    files[version] = []
  }

  const refFile: any = files[version].find(file => file.id === feature.id) || {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    data: {},
  }

  if (!files[version].find(file => file.id === feature.id)) {
    files[version].push(refFile)
  }

  if (rest.length === 1) {
    const [basename] = rest[0].split('.')
    refFile.data[basename] = refFileJsonModules(filepath)
  }

  if (rest.length === 2 && rest[0] === 'pages') {
    refFile.data.pages = refFile.data.pages || []
    refFile.data.pages.push(refFileJsonModules(filepath))
  }
})

export default files
