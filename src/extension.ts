// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as proc from './proc';

const path = require('path');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
		//console.log('Congratulations, your extension "nf" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('nf.workspaceFolder/', () => {
		return toFS(workspaceRoot());
	});
	context.subscriptions.push(disposable);

	let disposable1 = vscode.commands.registerCommand('nf.nfRoot', async () => {
		return getNFRoot();
	});
	context.subscriptions.push(disposable1);

	let disposable2 = vscode.commands.registerCommand('nf.nfRoot/', async () => {
		return toFS(await getNFRoot());
	});
	context.subscriptions.push(disposable2);

	let disposable3 = vscode.commands.registerCommand('nf.binaryDir', async () => {
		let ws = await vscode.commands.executeCommand('cmake.launchTargetPath');
		var ws2 = path.dirname(ws);
		return(ws2);
	});
	context.subscriptions.push(disposable3);

	let disposable4 = vscode.commands.registerCommand('nf.binaryDir/', async () => {
		let ws = await vscode.commands.executeCommand('cmake.launchTargetPath');
		var ws2 = toFS(path.dirname(ws));
		return(ws2);
	});
	context.subscriptions.push(disposable4);

	let disposable5 = vscode.commands.registerCommand('nf.AutoRun', async () => {
		return(await autoRun());
	});
	context.subscriptions.push(disposable5);

	autoRun(); // Run AutoRun.bat if it exists
}

// this method is called when your extension is deactivated
export function deactivate() {}

export function workspaceRoot()
{
	var ws = ".";
	if(vscode && vscode.workspace && vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]) {
		const wsp = vscode.workspace;
		ws = wsp.asRelativePath(vscode.workspace.workspaceFolders[0].uri,true);
	}
	return ws;
}

function fileExists(fpath : String) : boolean {
	try {
		if (fs.existsSync(fpath)) {
		  //file exists
		  return true;
		}
	  } catch(err) {
		console.error(err);
	  }
	  return false;
}

async function getNFRoot() : Promise<string>
{
	var fpath : string = path.format({
		dir: workspaceRoot(),
		base : "SetNFRoot.bat"
	});

	if(fileExists(fpath)) {
		var res = await proc.executeCMD(["SetNFRoot.bat"]).result;
		if(res.retc === 0 && res.stdout) {
			return(path.dirname(res.stdout));
		}
	}
	vscode.window.showInformationMessage('Warning: SetNFRoot.bat not found');
	return workspaceRoot() + "\\";
}

async function getNFRootFS() : Promise<string>
{
	return toFS(await getNFRoot());
}

function toFS(s : string) : string {
	return s.replace(/\\/g, "/");
}

async function autoRun()
{
	var fpath : string = path.format({
		dir: workspaceRoot(),
		base : "AutoRun.bat"
	});

	if(fileExists(fpath)) {
		var res = await proc.executeCMD(["AutoRun.bat"]).result;
		if(res.retc === 0 && res.stdout) {
			return(path.dirname(res.stdout));
		}
	}
	return workspaceRoot() + "\\";	
}