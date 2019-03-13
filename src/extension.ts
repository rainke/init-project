import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import makeFilesTree from './util/makeFilesTree';
import webpackConfig from './webpackConfig';

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const {commands, window} = vscode;

export function activate(context: vscode.ExtensionContext) {

  let disposable = commands.registerCommand('extension.initProject', async () => {
    const { name, rootPath } = vscode.workspace;
    const templatePath = path.resolve(__dirname, '../template');
    if (name && rootPath) {
      try {
        const files = await readdir(rootPath);
        if (files.length) {
          window.showWarningMessage('当前不在一个空的文件夹');
        } else {
          writeFile(path.resolve(rootPath, 'webpack.config.js'), webpackConfig);
          const [content, pkg] = await Promise.all([
            readFile(path.resolve(templatePath, 'public/index.html'), 'utf8'),
            readFile(path.resolve(templatePath, 'package.json'), 'utf8')
          ]);
          makeFilesTree(rootPath, {
            'public/index.html': content,
            'package.json':pkg
          });
        }
      } catch(e) {
        window.showErrorMessage(e.message);
      }
    } else {
      window.showInformationMessage('请打开一个文件夹');
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
