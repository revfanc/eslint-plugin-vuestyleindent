"use strict";

module.exports = {
  configs: {
    recommended: require("./config"),
  },
  rules: {
    "style-indent": require("./rules/style-indent.js"),
  },
};
