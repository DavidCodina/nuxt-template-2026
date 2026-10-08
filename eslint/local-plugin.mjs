// @ts-check
import { preferHttpError } from './rules/prefer-http-error.mjs'

/** @type {import('eslint').ESLint.Plugin} */
const plugin = {
  meta: { name: 'eslint-plugin-local' },
  rules: {
    'prefer-http-error': preferHttpError
  }
}

export default plugin
