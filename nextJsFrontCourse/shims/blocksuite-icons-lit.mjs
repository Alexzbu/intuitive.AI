// Shim to fix @blocksuite/data-view typo: CheckBoxCkeckSolidIcon → CheckBoxCheckSolidIcon
// Re-exports all icons from a known-good path and adds the typo alias
export * from "../node_modules/@blocksuite/affine-components/node_modules/@blocksuite/icons/dist/lit.mjs"
export { CheckBoxCheckSolidIcon as CheckBoxCkeckSolidIcon } from "../node_modules/@blocksuite/affine-components/node_modules/@blocksuite/icons/dist/lit.mjs"
