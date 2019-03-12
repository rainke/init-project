// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import webpackConfig from './webpackConfig';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		console.log('Congratulations, your extension "initproject" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.initProject', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		const {name, rootPath} = vscode.workspace;
		
		if(name && rootPath) {
			const writeFile = util.promisify(fs.writeFile);
			const readFile = util.promisify(fs.readFile);
			if(fs.existsSync(path.resolve(rootPath, 'webpack.config.js'))) {
				vscode.window.showInformationMessage('你已经有配置好的webpack.config.js！');
				return ;
			}

			writeFile(path.resolve(rootPath, 'webpack.config.js'), webpackConfig);
			let term = vscode.window.activeTerminal;
			if(!term) {
				term = vscode.window.createTerminal('init');
			}
			term.show();
			term.sendText('yarn add typescript webpack webpack-cli webpack-dev-server html-webpack-plugin friendly-errors-webpack-plugin -D');
			term.hide();
		} else {
			vscode.window.showInformationMessage('请打开一个文件夹');
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
