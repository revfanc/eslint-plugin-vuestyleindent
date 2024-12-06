/**
 * 1. 检查的文件类型为：vue
 * 2. 检查的代码范围为：style标签中的内容
 * 3. 缩进规则：同prettier对css代码的规则一致，2个空格
 * 4. 示例
  .rule {
    width: 22px;
    height: 61px;
    background-size: 100% 100%;
    position: absolute;
    right: 0;
    top: 105px;
    .child {
      width: 100px;
    }
  }
 */

 module.exports = {
   meta: {
     type: "layout",
     docs: {
       description: "enforce consistent indentation in <style> tags in .vue files",
       category: "Stylistic Issues",
       recommended: false,
       url: "https://eslint.vuejs.org/rules/style-indent.html"
     },
     fixable: "whitespace",
     schema: [
       {
         type: "integer",
         minimum: 0,
         maximum: 10
       }
     ]
   },
   create(context) {
    const sourceCode = context.getSourceCode();
    const indentSize = context.options[0] || 2;
    
    function getStyleContent(lines) {
      let styleContent = [];
      let inStyle = false;
      let baseIndent = 0;
  
      lines.forEach((line, index) => {
        if (line.trim().startsWith("<style")) {
          inStyle = true;
          baseIndent = line.search(/<style/);
          return;
        }
        if (line.trim().startsWith("</style>")) {
          inStyle = false;
          return;
        }
        if (inStyle && !line.trim().startsWith("<style")) {
          styleContent.push({
            content: line,
            lineNumber: index + 1,
            baseIndent
          });
        }
      });
      return styleContent;
    }
  
    return {
      "Program:exit"(node) {
        const lines = sourceCode.lines;
        const styleContent = getStyleContent(lines);
        
        // 跟踪花括号的嵌套层级
        let braceStack = 0;
        
        styleContent.forEach(({ content, lineNumber, baseIndent }) => {
          const trimmedLine = content.trim();
          if (!trimmedLine) return; // 跳过空行
  
          // 计算当前行的花括号情况
          const openBraces = (trimmedLine.match(/{/g) || []).length;
          const closeBraces = (trimmedLine.match(/}/g) || []).length;
          
          // 计算预期的缩进
          let expectedIndent = baseIndent;
          
          // 如果这行包含右花括号，使用上一层的缩进
          if (trimmedLine.startsWith('}')) {
            expectedIndent += (braceStack - 1) * indentSize;
          } else {
            expectedIndent += braceStack * indentSize;
          }
  
          const currentIndent = content.search(/\S|$/);
          
          // 更新花括号层级
          braceStack += openBraces - closeBraces;
  
          if (currentIndent !== expectedIndent) {
            context.report({
              node,
              loc: { line: lineNumber, column: 0 },
              message: `Expected indentation of ${expectedIndent} spaces but found ${currentIndent}.`,
              fix(fixer) {
                const range = [
                  sourceCode.getIndexFromLoc({ line: lineNumber, column: 0 }),
                  sourceCode.getIndexFromLoc({ line: lineNumber, column: content.length })
                ];
                return fixer.replaceTextRange(
                  range, 
                  " ".repeat(expectedIndent) + trimmedLine
                );
              }
            });
          }
        });
      }
    };
  }
 };
