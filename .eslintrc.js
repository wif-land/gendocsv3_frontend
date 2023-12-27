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
    "plugin:eslint-comments/recommended",
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
    "eslint-comments/no-use": [
      "error",
      { allow: ["eslint-disable-next-line"] },
    ],
    "func-call-spacing": ["error", "never"],
    "func-style": ["error", "expression", { allowArrowFunctions: true }],
    "grouped-accessor-pairs": "error",
    "max-classes-per-file": ["error", 2],
    "no-console": "warn",
    "no-constructor-return": "error",
    "no-duplicate-imports": "error",
    "no-empty-function": "off", // Conflicts with typescript-eslint rule.
    "@typescript-eslint/no-empty-function": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-extra-parens": ["error", "all", { ignoreJSX: "multi-line" }],
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
  // extends: ["next"],
  // rules: {
  //   "no-restricted-globals": 0,
  //   "@typescript-eslint/interface-name-prefix": 0,
  //   "filenames/match-regex": [
  //     "error",
  //     new RegExp("[a-z0-9]*" + "(.test)?" + "(.tsx)?$" + "|^.eslintrc$", "gmi"),
  //   ],
  //   "@typescript-eslint/naming-convention": [
  //     "error",
  //     {
  //       selector: "variable",
  //       format: ["camelCase", "PascalCase", "UPPER_CASE", "snake_case"],
  //       filter: {
  //         regex: "^((es|en)_([A-Z]+))$", // exception for language constants. Ex: es_EC
  //         match: false,
  //       },
  //       leadingUnderscore: "allow",
  //     },
  //     {
  //       selector: "interface",
  //       format: ["PascalCase"],
  //       custom: {
  //         regex: "^([I]+)$",
  //         match: false,
  //       },
  //     },
  //     {
  //       selector: "parameter",
  //       format: ["camelCase"],
  //       filter: {
  //         // exception for parameters with double underscore. Ex: parameter that receives dangerouslySetInnerHTML called __html
  //         regex: "(__[a-zA-Z0-9_]*(__)?)",
  //         match: false,
  //       },
  //       leadingUnderscore: "allow",
  //     },
  //     {
  //       selector: "property",
  //       format: ["camelCase", "UPPER_CASE", "snake_case", "PascalCase"],
  //       filter: {
  //         // exception for properties with same validation of language constants and double underscore.
  //         // Ex: call property es_EC in object or check __html have correct value inside the tests
  //         regex: "^((es|en)_([A-Z]+)|(__[a-zA-Z0-9_]*(__)?))$",
  //         match: false,
  //       },
  //       leadingUnderscore: "allow",
  //     },
  //   ],
  //   "@typescript-eslint/explicit-module-boundary-types": 0,
  //   "eslint-comments/no-unlimited-disable": 0,
  //   "import/no-unresolved": "off",
  //   "react/display-name": 0,
  // },
};
