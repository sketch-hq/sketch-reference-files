import { readFileSync, writeFileSync } from 'fs'
import semver from 'semver'
import { execSync } from 'child_process'
// @ts-ignore
import replaceSection from 'markdown-replace-section'
// @ts-ignore
import mdTable from 'markdown-table'

import { ReferenceFile } from '..'
// @ts-ignore
import files from '../dist'

const updateReadme = async () => {
  const sketchVersions = Object.keys(files)
    .map(v => ({ original: v, coerced: semver.coerce(v) }))
    .filter(v => !!v.coerced)
    .sort((a, b) => semver.compare(b.coerced!.version, a.coerced!.version))
    .map(v => {
      const truncated = v.original.split('.')
      while (truncated.slice(-1)[0] === '0') {
        truncated.pop()
      }
      return {
        ...v,
        truncated: truncated.join('.'),
      }
    })
  let content = ''
  sketchVersions.forEach(version => {
    const features: ReferenceFile[] = files[version.original]
    const documentVersion = features[0].data.meta.version
    const repoUrl = 'https://github.com/sketch-hq/sketch-reference-files'
    content += `### Sketch ${version.truncated} (document \`v${documentVersion}\`)\n\n`
    content += mdTable([
      ['Feature', '', '', '', ''],
      ...features.map(feature => [
        feature.name,
        `[Document](${repoUrl}/blob/master/files/${version.original}/${feature.id}/document.json)`,
        `[Page](${repoUrl}/blob/master/files/${version.original}/${feature.id}/pages/${feature.data.pages[0].do_objectID}.json)`,
        `[Meta](${repoUrl}/blob/master/files/${version.original}/${feature.id}/meta.json)`,
        `[User](${repoUrl}/blob/master/files/${version.original}/${feature.id}/user.json)`,
      ]),
    ])
    content += '\n\n'
  })
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
