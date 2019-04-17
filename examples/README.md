

# Examples for VS Code extension: `nf`

This directory and the `.vscode` subdirectory contain some examples for the use of the extension. They can be used as-is, or modified or extended to work with other targets.

## Top Level
Add these files to the root of your project (eg `nf-interpreter`)

### `AutoRun.bat`
If present the `nf` extension will run this script when the workspace is opened. It can be used to call `SetNFRoot.bat` to ensure the path-shortening `SUBST` command has been run, or to perform any other initialization tasks.
Make sure the script returns as soon as possible, if for example it leaves a hanging console this may block further vscode initialization. 

### `SetNFRoot.bat`
This is used to create a path shortening `SUBST` using a free drive letter if none exists, or to map to an existing one if it does. It also sets the environment variable `nfRoot` to that path (eg `"nfRoot=B:\"`) and returns the shortened path (eg `B:\`), so it can be used in command expansion.
The target of the `SUBST` is always the directory that `SetNFRoot.bat` is located in.  
Note that using the shortened path is only required for build with very long filenames and deep paths, at this stage some of the ChibiOS  builds. ESP32 does fine without it!

### `cmake-variants.json`
This example demonstrates how we can select multiple build targets from the same source, each saved in the subdirectory named for the `target` choice in the file. This follows the method used natively by the `VS2017` system and also the `BuildNF.bat` build system. So in the example file, the subdirectory used for the default build will be `Esp32_nanoCLR`. 
Note the use of the two variables in `${workspaceRoot}/build/${variant:target}` . The first, `${workspaceRoot}` is expanded by VS Code itself, while the second, `${variant:target}` is expanded by the `CMake-Tools` extension. Unfortunately the latter is not available consistentlyand is not currently exported by the expansion, so we have to add our own methods!


## Subdirectory `.vscode`

### `settings.json`
This demonstrates how we can set the build directory used by `CMake` accoring to the target name used in the `cmake-variants` file.  
### `"cmake.buildDirectory" : "${env:nfRoot}build/${variant:target}"`  
 Note that this example does not use the `nf` extension, but relies on the environment variable `nfroot` being set. It could now be done using `${command:nf.nfRoot}` instead, but predates the extension - why change what works?

### `tasks.json`
This demonstrates the use of locally set environmental variables to save on repetition and reduce confusing very long line lengths. If the COM port we are using changes, we only have to change it at one place, at the top of the file. Note the use of Windows style `%var%` variable expansion here. It is unfortunate that VS-Code does not handle variable expansion consistently yet, the use of `${var}` local variables in these files would be a big improvement! This implementation is currently restricted to Windows, but as nanoFramework builds are only supported on Windows 10 this it not a concern.  
You can see how the use of the `nf` extension's `${command:nf.binaryDir/}` variable allows consistent (almost identical) settings for each target.

### `launch.json`
Here once again the use of `${command:nf.binaryDir/}` allows for concise and consistent launch targets whendebugging the various nanoFramework builds.

## Release Notes


### Initial Release with 1.0.1 - 17 APR 2019
Inviting comments on implementation and documentation, please give it a try and get back with what works, what doesn't, what needs explanation and what could be improved.

