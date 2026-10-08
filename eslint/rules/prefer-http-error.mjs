// @ts-check

/**
 * Warns on any use of createError (from h3 / Nitro) and points to the
 * project's httpError() wrapper instead.
 *
 * Catches:
 *   createError({ ... })            – auto-imported or imported from h3
 *   new createError({ ... })
 *   import { createError as ce } from 'h3'  →  ce({ ... })
 *   h3.createError({ ... })         – namespace / member access
 */

const TARGET = 'createError'

const SOURCES = new Set(['h3', 'nitropack/runtime', 'nitro/h3'])

/** @type {import('eslint').Rule.RuleModule} */
export const preferHttpError = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer the httpError() utility over calling createError() directly.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          // Lets you rename the utility in the message without editing the rule
          replacement: { type: 'string' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      preferHttpError:
        'Prefer the `{{replacement}}` utility over `createError`. This will make the eventual migration to H3 v2 a single change.'
    }
  },

  create(context) {
    const options = context.options[0] ?? {}

    const replacement = options.replacement ?? 'httpError'

    // Local names that refer to createError (handles aliased imports)

    const localNames = new Set([TARGET])

    /** @param {import('estree').Node} callee */
    const isCreateError = (callee) => {
      if (callee.type === 'Identifier') {
        return localNames.has(callee.name)
      }
      if (
        callee.type === 'MemberExpression' &&
        !callee.computed &&
        callee.property.type === 'Identifier'
      ) {
        return callee.property.name === TARGET
      }
      return false
    }

    /** @param {import('estree').CallExpression | import('estree').NewExpression} node */

    const check = (node) => {
      if (isCreateError(node.callee)) {
        context.report({
          node: node.callee,
          messageId: 'preferHttpError',
          data: { replacement }
        })
      }
    }

    return {
      ImportDeclaration(node) {
        if (!SOURCES.has(String(node.source.value))) return

        for (const specifier of node.specifiers) {
          if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name === TARGET
          ) {
            localNames.add(specifier.local.name)
          }
        }
      },
      CallExpression: check,
      NewExpression: check
    }
  }
}
