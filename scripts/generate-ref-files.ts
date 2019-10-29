/**
 * Build the reference files from scratch for each required Sketch version.
 */

import { existsSync, mkdtempSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { sep, resolve } from 'path'
import { satisfies, coerce } from 'semver'
import { versions, features } from './config'

const exec = (command: string) => {
  try {
    execSync(command, { encoding: 'utf8' })
  } catch (err) {
    console.error(command)
    throw 'Build failed, stopping'
  }
}

const generateRefFiles = async () => {
  const filesDir = './files'
  const featuresDir = './features'
  const sketchAppsDir = './.sketch-apps'

  exec(`mkdir -p ${filesDir}`)

  for (const { document, sketchVersions } of versions) {
    const generator = [...sketchVersions].pop()
    if (!generator) continue
    const [sketchVersion] = generator
    console.log(`Generating files for document version ${document} with Sketch ${sketchVersion}`)
    const documentVersionDir = `${filesDir}/${document}`
    const sketchtoolBin = `${sketchAppsDir}/${sketchVersion}/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool`

    exec(`mkdir -p ${documentVersionDir}`)

    for (const feature of features) {
      const featureOutputDir = resolve(`${documentVersionDir}/${feature.id}`)

      if (existsSync(featureOutputDir)) {
        console.log(`  Skipping "${feature.id}", exists`)
        continue
      }

      if (!satisfies(coerce(sketchVersion) || '', feature.range)) {
        console.log(`  Skipping "${feature.id}", not compatible with generator`)
        continue
      }

      console.log(`  Generating "${feature.id}"`)

      exec(`mkdir -p ${featureOutputDir}`)

      // Generate a temporary plugin to do the work and invoke it with
      // the sketchtool binary for the current Sketch version

      const pluginDir = mkdtempSync(`${tmpdir()}${sep}`)
      const plugin = `${pluginDir}/plugin.sketchplugin`
      const pluginContents = `${plugin}/Contents/Sketch`
      const script = `${feature.id}.js`
      exec(`mkdir -p ${pluginContents}`)
      const manifest = {
        identifier: `com.reference-files.${sketchVersion}.${feature.id}`,
        commands: [
          {
            script,
            identifier: feature.id,
            handler: 'main',
            name: feature.name,
            description: feature.description,
          },
        ],
      }
      writeFileSync(`${pluginContents}/manifest.json`, JSON.stringify(manifest, null, 2))
      exec(`cp ${featuresDir}/${script} ${pluginContents}`)
      const context = JSON.stringify({ savePath: featureOutputDir })
      exec(`${sketchtoolBin} run ${plugin} ${feature.id} --context='${context}'`)
      exec(`unzip ${featureOutputDir}/output.sketch -d ${featureOutputDir}`)
      exec(`rm ${featureOutputDir}/*.sketch`)
      exec(`rm -rf ${featureOutputDir}/previews`)
      exec(`rm -rf ${featureOutputDir}/images`)
      exec(`rm -rf ${featureOutputDir}/text-previews`)
      exec(`rm -rf ${pluginDir}`)
    }
    // Sketch needs to be closed afterwards otherwise the sketchtools get
    // confused about which Sketch app to run the plugins in
    exec(`osascript -e 'quit app "Sketch"'`)
  }

  // Prettify everything we've generated
  exec(`yarn prettier --write ${filesDir}/**/*.json`)
}

try {
  generateRefFiles()
} catch (err) {
  console.error(err)
  process.exit(1)
}
