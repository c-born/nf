/*
 * Stripped down version of proc.ts from CMake-Tools extension
 */
import * as proc from 'child_process';
import * as nfe from './extension';

export interface ExecutionResult {
	retc: number|null;
	stdout: string;
	stderr: string;
  }

/**
 * Represents an executing subprocess
 */
export interface Subprocess {
	result: Promise<ExecutionResult>;
	child: proc.ChildProcess|undefined;
  }
  
  export interface BuildCommand {
	command: string;
	args?: string[];
	build_env?: {[key: string]: string};
  }
  
  export interface EnvironmentVariables { [key: string]: string; }
  
  export interface ExecutionOptions {
	environment?: EnvironmentVariables;
	shell?: boolean;
	silent?: boolean;
	cwd?: string;
	encoding?: BufferEncoding;
	outputEncoding?: string;
	useTask?: boolean;
  }
  
  export function buildCmdStr(command: string, args?: string[]): string {
	let cmdarr = [command];
	if (args) {cmdarr = cmdarr.concat(args);}
	return cmdarr.map(a => /[ \n\r\f;\t]/.test(a) ? `"${a}"` : a).join(' ');
  }
/**
 * Execute a command and return the result
 * @param command The binary to execute
 * @param args The arguments to pass to the binary
// * @param outputConsumer An output consumer for the command execution
 * @param options Additional execution options
 *
 * @note Output from the command is accumulated into a single buffer: Commands
 * which produce a lot of output should be careful about memory constraints.
 */
export function execute(command: string,
	args?: string[],
//	outputConsumer?: OutputConsumer | null,
	options?: ExecutionOptions): Subprocess {
	const cmdstr = buildCmdStr(command, args);

	if (!options) {
		options = {shell:true};
	}
	
	const final_env = process.env as EnvironmentVariables;
	const spawn_opts: proc.SpawnOptions = {
		env: final_env,
		shell: !!options.shell,
		cwd: nfe.workspaceRoot()
	};
	if (options && options.cwd) {
		spawn_opts.cwd = options.cwd;
	}
	
	let child: proc.ChildProcess | undefined;
	let result: Promise<ExecutionResult>;
 {
		child = proc.spawn(command, args, spawn_opts);

		result = new Promise<ExecutionResult>((resolve, reject) => {
			if (child) {
				child.on('error', err => { reject(err); });
				let stdout_acc = '';
				let line_acc = '';
				let stderr_acc = '';
				let stderr_line_acc = '';
				child.stdout.on('data', (data: Uint8Array) => {
					const str = data.toString();
					stdout_acc += str;
				});
				child.stderr.on('data', (data: Uint8Array) => {
					const str = data.toString();
					stderr_acc += str;
				});
				// Don't stop until the child stream is closed, otherwise we might not read
				// the whole output of the command.
				child.on('close', retc => {
					try {
						resolve({ retc, stdout: stdout_acc, stderr: stderr_acc });
					} catch (_) {
						// No error handling since Rollbar has taken the error.
						resolve({ retc, stdout: stdout_acc, stderr: stderr_acc });
					}
				});
			}
		});
	}
	return { child, result };
}