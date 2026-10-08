import { RuleTester } from 'eslint'
import { preferHttpError } from './prefer-http-error.mjs'

const tester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' }
})

tester.run('prefer-http-error', preferHttpError, {
  valid: [
    'httpError({ status: 404, message: \'Not found\' })',
    'const createErrorMessage = () => \'x\'',
    'foo.createErrors({})',
    'import { createError } from \'some-other-lib\'; const x = createError'
  ],
  invalid: [
    {
      code: 'createError({ statusCode: 404 })',
      errors: [{ messageId: 'preferHttpError' }]
    },
    {
      code: 'throw new createError({ statusCode: 500 })',
      errors: [{ messageId: 'preferHttpError' }]
    },
    {
      code: 'import { createError as ce } from \'h3\'; ce({ statusCode: 400 })',
      errors: [{ messageId: 'preferHttpError' }]
    },
    {
      code: 'import * as h3 from \'h3\'; h3.createError({ statusCode: 400 })',
      errors: [{ messageId: 'preferHttpError' }]
    },
    {
      code: 'createError({ statusCode: 404 })',
      options: [{ replacement: 'httpErr' }],
      errors: [{ message: /httpErr/ }]
    }
  ]
})

console.log('prefer-http-error: all tests passed')
