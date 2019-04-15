

# VS Code extension: `nf`

## Purpose

This VS Code extension is designed to enhance the use of VS Code 
when building the nanoFramework Interpreter with CMake and the CMake-Tools extension.

Some things it can help with include: 
1. Add additional variable expansion strings to VS-Code
2. Provide `/` separated paths on Windows
3. Help get around windows path length limitations when building with CMake
4. Workaround some features missing from CMake-Tools pending full multi-root support
5. Add configurable `AutoRun` tasks on opening a workspace

## Background

### CMake-Tools
CMake-Tools development is currently stalled as its developer and maintainer `Vector-of-Bool` is currently overloaded and looking for help. The API is currently unavailable in the latest release, pending a move to full multi-root support. There are some useful (to `nf`) updates in the repo but not in release, and no idea when the next release will be.
This extension adds some of those features pending them appearing in release at a later date.

### VS-Code Variables

VS Code provides several useful variables which can be used inside the `launch.json` and `tasks.json` files, including `${workspaceFolder}`.

However as of the current version of VS Code (1.33.0) variable expansion of this path uses either the Windows standard with backslash separators (eg `C:\users\David\Blinky`) or the Unix standard with slashes, (eg `/c/users/David/Blinky`) depending on the host platform.

This doesn't work when we need to pass the path to the `gdb` debugger on a Windows machine, as it still expects a normal (forward) slash separator, resulting in the paths having to be hardcoded strings in the files.
Not a huge issue, but a pain when moving folders or adding a `.vscode` folder to each of the Espressif-IDF examples to build and debug from VS Code.
This extension attempts to add the missing feature to VS Code and ease the pain somewhat.

### Windows Path Length Limitations
The 250 character Windows path length limitation randomly breaks some `nf` builds (eg STM32 with ChibIOS and OneWire) when the `nf-nterpreter` build is too deep in the files system. Rather than have this limitation dictate where you can keep your files, we can use the `SUBST` drive method to shorten the build path. This extension plus some batch scripts are able to automate this process.

### AutoRun Command Scripts
The AutoRun feature was added to ensure and path-shortening `subst` feature was in place before `CMake-Tools` fired up and configured the package. However  it may be of general use, as it can enable running any batch commands when the workspace is opened

## Usage

### Variable Substitution
Use in `launch.json` and `tasks.json` as required. Currently provided variables include:

* ${command:nf.workspaceFolder/} - ${workspaceFolder} with `/` path separators
* ${command:nf.buildDirectory} - Current config build directory, where the binaries go
* ${command:nf.buildDirectory/} - As above, with `/` path separators
* ${command:nf.nfRoot} - nf Root directory with (possibly) shortened path, eg `B:\`
* ${command:nf.nfRoot/} - As above, with `/` path separators eg `B:/`
* ${command:nf.AutoRun} - Execute the AutoRun.bat file (mainly for testing)


 So for example if:

`${workspaceFolder}` expands to  `C:\users\David\Blinky`

`${command:nf.workspaceFolder/}` expands to  `C:/users/David/Blinky`

Note `buildDirectory` is obtained from CMake-Tools, which has to have run a `Configure` before it is available. It will change with each configure, so you can have a separate directory for each build variant using `cmake-variants.json` and and entry in `cmake-settings.json` like 
```json
"cmake.buildDirectory" : "${workspaceRoot}/build/${variant:target}"
```

## References

There have been several requests to the VS Code developers to add a method to work around the lack of `/` separator problem over the years, so far none have been adopted:


https://github.com/Microsoft/vscode-cpptools/issues/908

https://github.com/Microsoft/vscode/issues/40288

### For the current state of the `CMake-Tools` expansion, see:

https://github.com/vector-of-bool/vscode-cmake-tools/issues/582

https://github.com/vector-of-bool/vscode-cmake-tools/issues/665

## Known Issues

Currently doesn't handle multi-root projects.

Much would be better handled in `CMake-Tools` and VS Code itself.

Only designed for Windows, and probably a subset of configurations, until I hear back from other testers.

Please give it a run and let me know what other variable substitutions wuld be of use!

## Release Notes


### 1.0.0 (alpha)

Initial release of `nf` extension

