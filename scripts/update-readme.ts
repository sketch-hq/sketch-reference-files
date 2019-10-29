/**
 * Dynamically update the "Browse" tables of the readme.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
// @ts-ignore
import replaceSection from 'markdown-replace-section'
// @ts-ignore
import mdTable from 'markdown-table'
import pkg from '../package.json'
import { versions, features } from './config'

const updateReadme = async () => {
  let content = ''
  for (const { document, sketchVersions } of versions) {
    content += `### Document ${document}\n\n`
    content += `> Sketch versions: ${sketchVersions
      .map(versionTuple => versionTuple[0])
      .join(', ')}\n\n`
    const repoUri = `https://github.com/sketch-hq/sketch-reference-files/tree/v${pkg.version}/files`
    content += mdTable([
      ['Feature', 'Document', 'Pages', 'Meta', 'User'],
      ...features.map(feature => {
        const exists = existsSync(`./files/${document}/${feature.id}`)
        return exists
          ? [
              feature.name,
              `[🔗](${repoUri}/${document}/${feature.id}/document.json)`,
              `[🔗](${repoUri}/${document}/${feature.id}/pages)`,
              `[🔗](${repoUri}/${document}/${feature.id}/meta.json)`,
              `[🔗](${repoUri}/${document}/${feature.id}/user.json)`,
            ]
          : [feature.name, '-', '-', '-', '-']
      }),
    ])
    content += '\n\n'
  }
  const readme = readFileSync('./README.md', { encoding: 'utf8' })
  writeFileSync('./README.md', replaceSection(readme, 'Browse', content))
  execSync(`yarn prettier --write ./README.md`, { encoding: 'utf8' })
}

try {
  updateReadme()
} catch (err) {
  console.error(err)
  process.exit(1)
}
