module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
  },
  plugins: [
    "@typescript-eslint",
    "fetch",
    "filenames",
    "import",
    "prefer-arrow",
  ],
  ignorePatterns: [".eslintrc.js"],
  extends: [
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:fetch/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "variable",
        format: ["camelCase", "PascalCase", "UPPER_CASE"],
        filter: {
          regex: "^((es|en)_([A-Z]+))$",
          match: false,
        },
        leadingUnderscore: "allow",
      },
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^([I]+)$",
          match: false,
        },
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "property",
        format: ["camelCase", "UPPER_CASE", "PascalCase"],
        filter: {
          regex: "^((es|en)_([A-Z]+))$",
          match: false,
        },
        leadingUnderscore: "allow",
      },
      {
        selector: "function",
        format: ["camelCase", "PascalCase"],
      },
    ],
    "no-param-reassign": "error",
    "@typescript-eslint/no-this-alias": "error",
    curly: ["error", "multi-line"],
    eqeqeq: ["error", "smart"],
    "func-call-spacing": ["error", "never"],
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
    "grouped-accessor-pairs": "error",
    "max-classes-per-file": ["warn", 4],
    "no-console": "warn",
    "no-constructor-return": "error",
    "no-duplicate-imports": "error",
    "no-empty-function": "off", // Conflicts with typescript-eslint rule.
    "@typescript-eslint/no-empty-function": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-multi-spaces": "error",
    "no-multi-str": "error",
    "no-multiple-empty-lines": "error",
    "no-new-wrappers": "error",
    "no-template-curly-in-string": "error",
    "no-trailing-spaces": "error",
    "no-underscore-dangle": "error",
    "no-unneeded-ternary": "warn",
    "no-unused-vars": "off", // Conflicts with the typescript rule.
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-var": "error",
    "object-shorthand": "error",
    "one-var": ["error", "never"],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "quote-props": ["error", "as-needed"],
    "require-atomic-updates": "error",
    "arrow-body-style": ["error", "as-needed"],
    "prefer-arrow/prefer-arrow-functions": [
      "error",
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
      },
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        markers: ["/"],
      },
    ],
    "prettier/prettier": ["error", { singleQuote: true, semi: false }],
    "prefer-template": "warn",
    "max-len": [
      "error",
      { code: 100, ignorePattern: "^(export|import|(^it+)*|(^describe+)*)" },
    ],
    "@typescript-eslint/interface-name-prefix": 0,
    "no-restricted-globals": 0,
  },
  overrides: [
    {
      files: "**.ts*",
      excludedFiles: "*.test.*",
      rules: {
        "no-magic-numbers": [
          "error",
          { ignore: [0, 1, -1, -2], ignoreArrayIndexes: true },
        ],
      },
    },
  ],
};