/**
 * Download and prepare all versions of Sketch required to generate the
 * reference files.
 */

import { existsSync, createWriteStream } from 'fs'
import { execSync } from 'child_process'
import { config } from './config'
import fetch from 'node-fetch'
import stream from 'stream'
import util from 'util'

const exec = (command: string) => execSync(command, { encoding: 'utf8' })

const streamPipeline = util.promisify(stream.pipeline)

const downloadSketchApps = async () => {
  const root = './.sketch-apps'
  exec(`mkdir -p ${root}`)

  for (const { version, build } of config) {
    console.log(`Sketch ${version}`)
    const dir = `${root}/${version}`
    const app = `${dir}/Sketch.app`
    const download = `${dir}/Sketch.${version}.zip`

    exec(`mkdir -p ${dir}`)

    const exists = existsSync(app)
    if (exists) {
      console.log(`  Complete`)
      continue
    } else {
      console.log(`  Downloading...`)
    }

    const res = await fetch(`https://download.sketchapp.com/sketch-${version}-${build}.zip`)

    if (!res.ok) {
      console.log(`Error downloading: ${res.statusText}`)
      continue
    }

    await streamPipeline(res.body, createWriteStream(download))

    console.log(`  Decompressing...`)

    exec(`unzip ${download} -d ${dir}`)
    exec(`rm ${download}`)

    console.log('  Complete')
  }
}

downloadSketchApps()
