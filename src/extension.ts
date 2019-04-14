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
	let disposable = vscode.commands.registerCommand('nf.workspaceFolderFS', () => {
		// The code you place here will be executed every time your command is executed
/*		var ws = "Undefined";

		if(vscode && vscode.workspace && vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0]) {
			const wsp = vscode.workspace;
			ws = wsp.asRelativePath(vscode.workspace.workspaceFolders[0].uri,true);
		}
*/		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World #1 from nf Extension!');
		var ws = workspaceRoot();
		var ws2 = ws.replace(/\\/g, "/");

		return(ws2);
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('nf.binaryDir', async () => {
		let ws = await vscode.commands.executeCommand('cmake.launchTargetPath');
		var ws2 = path.dirname(ws);
		return(ws2);
	});

	context.subscriptions.push(disposable2);

	let disposable3 = vscode.commands.registerCommand('nf.nfRoot', async () => {
/*		let cmds = await vscode.commands.getCommands();
		cmds.forEach(element => {
			console.log(element);
		});
*/
/*		const term = vscode.window.createTerminal("nf","C:\\Windows\\System32\\cmd.exe");
		term.show;
		term.sendText("SetNFRoot.bat");
*/
		return getNFRoot();

		//var res = await proc.execute("C:\\Windows\\System32\\cmd.exe", ["/C","SetNFRoot.bat"]).result;
		var res = await proc.executeCMD(["SetNFRoot.bat"]).result;
		if(res.retc === 0 && res.stdout) {
			return(path.dirname(res.stdout));
		}
		console.log(res.stderr);
//		var res = await execute("SetNFRoot.bat");
		return("Need to write nfRoot code!");
	});

	context.subscriptions.push(disposable3);
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
//	var fpath = workspaceRoot() + "\\" + "SetNFRoot.bat";
	if(fileExists(fpath)) {
		//var res = await proc.execute("C:\\Windows\\System32\\cmd.exe", ["/C","SetNFRoot.bat"]).result;
		var res = await proc.executeCMD(["SetNFRoot.bat"]).result;
		if(res.retc === 0 && res.stdout) {
			return(path.dirname(res.stdout));
		}
	}
	return workspaceRoot();
}