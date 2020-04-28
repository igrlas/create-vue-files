// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getTsTemplate } from './templates/tsTemplate';
import { getVueTemplate } from './templates/vueTemplate';
import path = require('path');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('extension.createFile', (e) => {

		if (!e) {
			vscode.window.showErrorMessage(`Please use create vue file from explorer window.`);
			return;
		}

		var selectedLocation = e.fsPath;

		vscode.window.showInputBox()
			.then(name => createComponent(name || '', selectedLocation));


	});

	context.subscriptions.push(disposable);
}

function createComponent(name: string, selectedLocation: string) {

	if (isEmptyOrWhitespace(name)) {
		vscode.window.showErrorMessage(`Name is required to create vue component.`);
		return;
	}
	if (isForwardOrTrailingWhitespace(name)) {
		vscode.window.showErrorMessage(`Name can not start or end on whitespace.`);
		return;
	}

	name = upperCase(name).toString();

	var vueTemplate = getVueTemplate(name);
	var tsTemplate = getTsTemplate(name);
	var htmlTemplate = ``;
	var scssTemplate = ``;

	var fs = require('fs');

	selectedLocation = ensureDirectory(fs, selectedLocation);

	var dir = path.join(selectedLocation, name);
	var file = path.join(dir, `${name}.component`);

	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
		fs.appendFileSync(`${file}.ts`, tsTemplate);
		fs.appendFileSync(`${file}.html`, htmlTemplate);
		fs.appendFileSync(`${file}.scss`, scssTemplate);
		fs.appendFileSync(`${file}.vue`, vueTemplate);

		vscode.window.showInformationMessage(`${name} created!`);
	}
}

function isEmptyOrWhitespace(str: any): boolean {
	return !str || !str.trim();
}

function isForwardOrTrailingWhitespace(str: any): boolean {
	return isEmptyOrWhitespace(str.slice(0, 1)) || isEmptyOrWhitespace(str.slice(str.length - 1, str.length));
}

function ensureDirectory(fs: any, path: string): string {
	if (!fs.lstatSync(path).isDirectory()) {
		var index = path.lastIndexOf("\\");
		if (index < 1) {
			vscode.window.showErrorMessage("Can not find selected directory.");
			throw { message: "Can not find directory." };
		}
		path = path.slice(0, index);

		ensureDirectory(fs, path);
	}

	return path;

}

function upperCase(name: String): String {

	return name.slice(0, 1).toUpperCase() + name.slice(1, name.length);

}

// this method is called when your extension is deactivated
export function deactivate() { }
