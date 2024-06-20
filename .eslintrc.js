module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  root: true,
  extends: [
    "next",
    "eslint:recommended",
    "prettier",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: [
    "prettier",
    "@typescript-eslint",
    "react",
    "react-hooks",
    "unused-imports",
    "eslint-plugin-import-helpers",
  ],
  rules: {
    // JavaScript rules
    "prefer-const": "warn",
    "no-var": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    "object-shorthand": "warn",
    "quote-props": ["warn", "as-needed"],
    // TypeScript rules
    "@typescript-eslint/array-type": [
      "warn",
      {
        default: "array",
      },
    ],
    "@typescript-eslint/consistent-type-assertions": [
      "warn",
      {
        assertionStyle: "as",
        objectLiteralTypeAssertions: "allow-as-parameter",
      },
    ],
    // React rules
    "react/jsx-fragments": ["warn", "syntax"], // Shorthand syntax for React fragments
    "react/jsx-filename-extension": [
      "warn",
      {
        extensions: ["ts", "tsx"],
      },
    ],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "prettier/prettier": "warn",
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "never",
        groups: [
          ["/^react/", "/^(next|(next/.*))$/"],
          "absolute",
          "module",
          "/^@.*components.*/",
          "/^@.*hooks.*/",
          "/^@.*assets.*/",
          "/^@/.*/",
          ["parent", "sibling", "index"],
        ],
        alphabetize: { order: "asc", ignoreCase: true },
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
