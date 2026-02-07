import js from "@eslint/js";

export default [
  {
    ignores: [
      "node_modules/**",
      "generated/**"
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: {
        console: "readonly",
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": "warn",
    },
  },
];
