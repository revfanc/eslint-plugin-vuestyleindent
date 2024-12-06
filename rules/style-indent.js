/**
 * 1. 检查代码中的缩进是否一致
 * 2. 如果缩进不一致，则报错
 * 3. 缩进规则为：2个空格
 * 4. 检查的文件类型为：vue
 * 5. 检查的代码范围为：style标签中的内容
 */

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation in <style> sections',
      category: 'Stylistic Issues',
      recommended: true
    },
    fixable: 'whitespace',
    schema: []
  },

  create(context) {
    return {
      'Program:exit'(node) {
        const sourceCode = context.getSourceCode();
        const lines = sourceCode.getText().split('\n');
        let inStyle = false;
        let expectedIndent = 2;

        lines.forEach((line, index) => {
          // Check if we're entering/exiting a style block
          if (line.trim().startsWith('<style')) {
            inStyle = true;
            return;
          }
          if (line.trim().startsWith('</style>')) {
            inStyle = false;
            return;
          }

          if (inStyle && line.trim()) {
            const currentIndent = line.match(/^\s*/)[0].length;
            if (currentIndent % expectedIndent !== 0) {
              context.report({
                loc: {
                  start: { line: index + 1, column: 0 },
                  end: { line: index + 1, column: line.length }
                },
                message: `Invalid indentation, expected multiples of ${expectedIndent} spaces`,
                fix(fixer) {
                  const properIndent = ' '.repeat(Math.round(currentIndent / expectedIndent) * expectedIndent);
                  return fixer.replaceText(node, line.replace(/^\s*/, properIndent));
                }
              });
            }
          }
        });
      }
    };
  }
};


