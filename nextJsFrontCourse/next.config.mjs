import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const shimPath = path.resolve(__dirname, "shims/blocksuite-icons-lit.mjs")

/** @type {import('next').NextConfig} */
export default {
   experimental: {
      optimizePackageImports: ["@chakra-ui/react"],
   },
   webpack(config, { webpack }) {
      // @blocksuite/store top-level was removed (its published package.json wrongly exports src/*.ts).
      // Alias it to the compiled version nested under @blocksuite/blocks.
      config.resolve.alias["@blocksuite/store"] = path.resolve(
         __dirname,
         "node_modules/@blocksuite/blocks/node_modules/@blocksuite/store"
      )

      // Fix @blocksuite/data-view typo: CheckBoxCkeckSolidIcon → CheckBoxCheckSolidIcon
      // Use NormalModuleReplacementPlugin to catch nested node_modules resolutions
      config.plugins.push(
         new webpack.NormalModuleReplacementPlugin(
            /@blocksuite\/icons\/lit/,
            shimPath
         )
      )
      return config
   },
}
