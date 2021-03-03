const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'),
);

module.exports = {
  "env": {
    "node": true,
    "es6": true,
  },
  "extends": ["eslint:recommended", "google", "prettier"],
  "plugins": ["prettier"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2019,
    "sourceType": "module"
  },
  "rules": {
    'prettier/prettier': ['error', prettierOptions],
    "require-jsdoc": 0,
    "indent": ["error", 2],
    "new-cap": 0,
    'newline-per-chained-call': 1,
  },
};

