/**
 * Build the reference files from scratch for each required Sketch version.
 */

import { existsSync, mkdtempSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { tmpdir } from 'os'
import { sep, resolve } from 'path'
import { config } from './config'

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

  // The config lists all the active Sketch versions we want to generate ref
  // files for, so we loop over it

  for (const { version, features } of config) {
    console.log(`Sketch ${version}`)

    const dir = `${filesDir}/${version}`
    const sketchtoolBin = `${sketchAppsDir}/${version}/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool`

    exec(`mkdir -p ${dir}`)

    // For each feature build the reference files for it

    for (const feature of features) {
      const output = resolve(`${dir}/${feature.id}`)

      if (existsSync(output)) {
        console.log(`  Skipping "${feature.id}" ref files, already exist`)
        continue
      }

      console.log(`  Building "${feature.id}" ref files`)

      exec(`mkdir -p ${output}`)

      // Generate a temporary plugin to do the work and invoke it with
      // the sketchtool binary for the current Sketch version

      const pluginDir = mkdtempSync(`${tmpdir()}${sep}`)
      const plugin = `${pluginDir}/plugin.sketchplugin`
      const pluginContents = `${plugin}/Contents/Sketch`
      const script = `${feature.id}.js`
      exec(`mkdir -p ${pluginContents}`)
      const manifest = {
        identifier: `com.reference-files.${version}.${feature.id}`,
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
      const context = JSON.stringify({ savePath: output })
      exec(`${sketchtoolBin} run ${plugin} ${feature.id} --context='${context}'`)
      exec(`unzip ${output}/output.sketch -d ${output}`)
      exec(`rm ${output}/*.sketch`)
      exec(`rm -rf ${output}/previews`)
      exec(`rm -rf ${output}/text-previews`)
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
