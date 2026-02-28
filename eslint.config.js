import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from 'typescript-eslint'

export default [
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // 必要に応じてルールを追加・変更できます
    },
  },
  {
    ignores: ['dist/', '.astro/', 'node_modules/'],
  },
]
