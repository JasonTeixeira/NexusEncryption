import { fileURLToPath } from 'url'
import path from 'path'
import iconGen from 'icon-gen'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const src = path.resolve(__dirname, '../public/icon.svg')
  const outDir = path.resolve(__dirname, '../build/icons')

  try {
    await iconGen(src, outDir, {
      report: true,
      ico: { name: 'icon', sizes: [16, 24, 32, 48, 64, 128, 256] },
      icns: { name: 'icon', sizes: [16, 32, 64, 128, 256, 512, 1024] },
      favicon: { name: 'favicon', pngSizes: [16, 32, 48, 64, 128, 256, 512, 1024], icoSizes: [16, 24, 32, 48, 64] },
      modes: ['ico', 'icns', 'png']
    })
    console.log('Icons generated in', outDir)
  } catch (err) {
    console.error('Icon generation failed:', err)
    process.exit(1)
  }
}

main()
