'use strict'

var extract = require('./extract')

var blocksInfo = [] // code, line, indent

var tagProcessor = {
  preprocess: function(content) {
    blocksInfo = extract(content)
    return blocksInfo.map((blockInfo) => blockInfo.code)
  },
  postprocess: function(messages, filename) {
    var messagesToReturn = []
    messages.forEach(function (messageErrors, messageIdx) {
      messageErrors.forEach(function (messageError, messageErrIdx) {
        messageError.column += blocksInfo[messageIdx].indent
        messageError.line += (blocksInfo[messageIdx].line - 1)
        messagesToReturn.push(messageError)
      })
    })
    return messagesToReturn
  }
}

module.exports = {
  configs: {
    recommended: {
      plugins: ['oval'],
      rules: {
        'no-unused-vars': [0],
        'no-unused-expressions': [0]
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
