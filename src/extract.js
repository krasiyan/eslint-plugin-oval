'use strict'

var htmlparser = require('htmlparser2')

function extract(code) {

  var scriptCode = ''
  var tagExpressions = []
  var tagStartLineNum = 0
  var inScript = false
  var indent
  var indentRegex

  var parser = new htmlparser.Parser({
    onopentag: function(name, attrs) {
      // test if current tag is a valid <script> tag.
      if (name === 'script') {
        inScript = true
        tagStartLineNum = code.slice(0, parser.endIndex).match(/\r\n|\n|\r/g).length + 1
      } else {
        var jsRegex = new RegExp(/\{([^}]+)\}/, 'gm')
        var matchedExpressions = code.slice(parser.startIndex, parser.endIndex).trim().match(jsRegex)
        if (!matchedExpressions) return
        matchedExpressions.forEach(function (matchedExpression) {
          tagExpressions.push({
            code: matchedExpression.substring(1, matchedExpression.length - 1) + '\n',
            indent: 0,
            line: code.slice(0, parser.endIndex).match(/\r\n|\n|\r/g).length + 1
          })
        })
      }
    },

    onclosetag: function(name) {
      if (name !== 'script' || !inScript) {
        return
      }
      inScript = false
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
        var jsRegex = new RegExp(/\{([^}]+)\}/, 'gm')
        var matchedExpressions = data.trim().match(jsRegex)
        if (!matchedExpressions) return
        matchedExpressions.forEach(function (matchedExpression) {
          tagExpressions.push({
            code: matchedExpression.substring(1, matchedExpression.length - 1) + '\n',
            indent: 0,
            line: code.slice(0, parser.endIndex).match(/\r\n|\n|\r/g).length + 1
          })
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
  console.log(JSON.stringify(tagExpressions, null, 2))

  return [{ code: scriptCode, line: tagStartLineNum, indent: indent }].concat(tagExpressions)
}

module.exports = extract
