// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import webpackConfig from './webpackConfig';

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('extension.initProject', () => {
    const { name, rootPath } = vscode.workspace;

    if (name && rootPath) {
      const writeFile = util.promisify(fs.writeFile);
      const readFile = util.promisify(fs.readFile);
      const readdir = util.promisify(fs.readdir);
      readdir(rootPath)
        .then(files => {
          if (files.length) {
            vscode.window.showWarningMessage('当前不在一个空的文件夹');
          } else {
            writeFile(path.resolve(rootPath, 'webpack.config.js'), webpackConfig);
            let term = vscode.window.activeTerminal;
            if (!term) {
              term = vscode.window.createTerminal('init');
            }
            term.show();
            term.sendText(
              'yarn add typescript webpack webpack-cli webpack-dev-server html-webpack-plugin friendly-errors-webpack-plugin -D'
            );
          }
        })
        .catch(err => {
          vscode.window.showErrorMessage(err.message);
        });
    } else {
      vscode.window.showInformationMessage('请打开一个文件夹');
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
