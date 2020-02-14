/**
 * Dynamically update the "Browse" tables of the readme.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
// @ts-ignore
import replaceSection from 'markdown-replace-section'
// @ts-ignore
import mdTable from 'markdown-table'
import { versions, features } from './config'

const updateReadme = async () => {
  let content =
    '> ⚠️ This section is automatically generated. Any manual edits will be erased during a build.\n\n'
  for (const { document, sketchVersions } of [...versions].reverse()) {
    content += `### Document ${document}\n\n`
    content += `> Sketch versions: ${sketchVersions
      .map(versionTuple => versionTuple[0])
      .join(', ')}\n\n`
    const repoUri = `https://github.com/sketch-hq/sketch-reference-files/blob/master/files`
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
