'use strict'

var htmlparser = require('htmlparser2')

function extract(code) {

  var scriptCode = ''
  var tagExpressions = []
  var tagStartLineNum = 0
  var finished = false
  var inScript = false
  var indent
  var indentRegex

  var parser = new htmlparser.Parser({

    onopentag: function(name, attrs) {
      // test if current tag is a valid <script> tag.
      if (name !== 'script') {
        return
      }

      if (finished) {
        return
      }

      inScript = true
      tagStartLineNum = code.slice(0, parser.endIndex).match(/\r\n|\n|\r/g).length + 1
    },

    onclosetag: function(name) {
      if (name !== 'script' || !inScript) {
        return
      }
      inScript = false
      finished = true
    },

    ontext: function(data) {
      if (inScript) {
        if (!indent) {
          var spaces = /^[\n\r]*(\s*)/.exec(data)[1]
          indentRegex = new RegExp('^(?:' + spaces + ')?(.*)', 'gm')
          indent = spaces.length
        }

        // dedent code
        scriptCode += data.replace(indentRegex, function(_, line) {
          return line
        })
      } else {
        var jsRegex = new RegExp('\{([^}]+)\}', 'gm')
        var matchedExpressions = data.trim().match(jsRegex)
        if (!matchedExpressions) return
        matchedExpressions.forEach(function (matchedExpression) {
          tagExpressions.push(matchedExpression.substring(1, matchedExpression.length - 1))
        })
      }
    }
  })

  parser.parseComplete(code)

  if (!indent) {
    indent = 0
  }
  // trim the last line's ending spaces
  scriptCode = scriptCode.replace(/[ \t]*$/, '')
  if (tagExpressions.length > 0) {
    tagExpressions.forEach((tagExpression) => {
      scriptCode += '\n' + tagExpression + ' // eslint-disable-line no-unused-expressions'
    })
    scriptCode += '\n'
  }

  return { code: scriptCode, line: tagStartLineNum, indent: indent }
}

module.exports = extract
