module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    node: true
  },

  rules: {
    "no-unused-vars": "off"
  },
  parser: "babel-eslint",
  extends: ["eslint:recommended", "google"]
};
