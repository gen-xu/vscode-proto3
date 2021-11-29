"use strict";

import path = require("path");
import vscode = require("vscode");
import fg = require("fast-glob");
import fs = require("fs");

export module Proto3Import {
  export const importStatementRegex = new RegExp(/^\s*import\s+('|")(.+\.proto)('|")\s*;\s*$/gim);

  export const getImportedFilePathsOnDocument = async (document: vscode.TextDocument) => {
    const fullDocument = document.getText();
    let importStatement: RegExpExecArray;
    let importPaths = [];
    while ((importStatement = importStatementRegex.exec(fullDocument))) {
      const protoFileName = importStatement[2];
      let importPath = path.join(vscode.workspace.getWorkspaceFolder(document.uri).uri.fsPath, protoFileName);
      if (fs.existsSync(importPath)) {
        importPaths.push(importPath);
      }
      importPaths.push(
        ...(await fg(path.join(vscode.workspace.getWorkspaceFolder(document.uri).uri.fsPath, "**", protoFileName)))
      );
    }
    return importPaths;
  };
}
