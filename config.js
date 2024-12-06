module.exports = {
  plugins: ['vuestyleindent'],

  parserOptions: {
    parser: require.resolve('babel-eslint'),
    ecmaVersion: 2017,
    sourceType: 'module'
  },

  env: {
    es6: true,
    node: true
  },

  globals: {
    document: false,
    navigator: false,
    window: false
  },

  rules: {
    'vuestyleindent/style-indent': 'error'
  }
}
