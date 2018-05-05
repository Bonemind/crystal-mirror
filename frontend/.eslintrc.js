module.exports = {
   'extends': 'airbnb-base',
   'plugins': [
      'import',
      'react',
      'jest',
   ],
   'rules': {
      'linebreak-style': 'off',
      'no-unused-vars': [2, { 'varsIgnorePattern': 'h' }],
      'max-len': ['error', { 'code': 120 }],
      'react/jsx-uses-vars': 2,
      'indent': ['error', 3],
   },
   'parserOptions': {
      'ecmaFeatures': {
         'jsx': true,
      },
   },
   'env': {
      'browser': true,
      'jest': true,
   }
};
