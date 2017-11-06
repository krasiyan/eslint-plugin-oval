'use strict'

var extract = require('./extract')

var blockInfo // code, line, indent

var tagProcessor = {
  preprocess: function(content) {
    blockInfo = extract(content)
    return [blockInfo.code]
  },

  postprocess: function(messages, filename) {
    messages[0].forEach(function(message) {
      message.column += blockInfo.indent
      message.line += (blockInfo.line - 1)
    })
    return messages[0]
  }
}

module.exports = {
  configs: {
    recommended: {
      plugins: ['oval'],
      rules: {
        'no-unused-vars': [0]
      },
      globals: {
        tag: true
      }
    }
  },
  processors: {
    '.html': tagProcessor,
    '.tag': tagProcessor
  }
}
