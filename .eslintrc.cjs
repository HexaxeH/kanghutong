/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = [
  // 第一个对象：配置忽略规则
  {
    ignores: [
      'node_modules/',
      'dist/',
      'unpackage/',
      '.git/',
      '*.min.js',
      // 其他需要忽略的路径...
    ]
  },
  // 第二个对象：核心规则配置
  {
    root: true,
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      '@vue/eslint-config-prettier'
    ],
    globals: {
      uni: true,
      wx: true,
      WechatMiniprogram: true,
      getCurrentPages: true,
      getApp: true,
      UniApp: true,
      UniHelper: true,
      App: true,
      Page: true,
      Component: true,
      AnyObject: true,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true,
          semi: false,
          printWidth: 100,
          trailingComma: 'all',
          endOfLine: 'auto',
        },
      ],
      'vue/multi-word-component-names': ['off'],
      'vue/no-setup-props-destructure': ['off'],
      'vue/no-deprecated-html-element-is': ['off'],
      'no-unused-vars': ['off'],
    },
  }
]