/**
 * Npm module entrypoint, built into `dist`.
 *
 * Uses the Webpack `require.context` API to bundle all reference file JSON.
 * @see https://webpack.js.org/guides/dependency-management/#context-module-api
 */

import { versions, features } from './scripts/config'

const context = require.context('./files', true, /\.json$/)
const paths = context.keys()

export type ReferenceFileGroup = {
  files: ReferenceFile[]
  document: number
  sketchVersions: string[]
}

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

const data: ReferenceFileGroup[] = []

for (const { document, sketchVersions } of versions) {
  const group: ReferenceFileGroup = {
    files: [],
    document,
    sketchVersions: sketchVersions.map(versionTuple => versionTuple[0]),
  }

  data.push(group)

  for (const feature of features) {
    const documentPath = `./${document}/${feature.id}/document.json`
    const metaPath = `./${document}/${feature.id}/meta.json`
    const pagesPath = `./${document}/${feature.id}/pages`
    const userPath = `./${document}/${feature.id}/user.json`

    const featureExists = !!paths.find(path => path === documentPath)

    if (!featureExists) continue

    const documentJson = context(documentPath)
    const metaJson = context(metaPath)
    const userJson = context(userPath)
    const pagesJson = paths.filter(path => path.startsWith(pagesPath)).map(path => context(path))

    group.files.push({
      id: feature.id,
      name: feature.name,
      description: feature.description,
      data: {
        document: documentJson,
        meta: metaJson,
        user: userJson,
        pages: pagesJson,
      },
    })
  }
}

export default data
