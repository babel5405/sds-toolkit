const { exec } = require('child_process');
let Config = require("./config.json");
const {resolve} = require("path");
let Chokidar = null;
let BrowserSync = null;

// Resolve relative paths to aboslute so we can
// allow users to provide relative directories.
Config.Web.Path = resolve(Config.Web.Path);
Config.Web.Path = resolve(Config.File.Path);

if (Config.Web.Enable) {
    BrowserSync = require("browser-sync").create();
}

if (Config.File.Enable) {
    Chokidar = require("Chokidar");
}

if (Chokidar != null) {
    let Watcher;
    let ready = false;

    if (Config.File.ignoreDots == true) {
        Watcher = Chokidar.watch(Config.File.Path, {ignored: Config.File.Excluded, persistent: true});
    } else {
        Watcher = Chokidar.watch(Config.File.Path, {persistent: true});
    }

    Watcher.on('ready', function() {
        console.log("File Watcher Loaded");
        ready = true;
    })

    Watcher.on('add', function(path) {
        if (ready) {
            console.log('File', path, 'has been added');
            RunCommands(Config.File.Commands.Add).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
    });

    Watcher.on('addDir', function(path) {
        if (ready) {
            console.log('Directory', path, 'has been added');
            RunCommands(Config.File.Commands.Add).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
    });

    Watcher.on('change', function(path) {
        if (ready) {
            console.log('File', path, 'has been changed');
            RunCommands(Config.File.Commands.Save).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
        
    });

    Watcher.on('unlink', function(path) {
        if (ready) {
            console.log('File', path, 'has been removed');
            RunCommands(Config.File.Commands.Remove).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
        
    });

    Watcher.on('unlinkDir', function(path) {
        if (ready) {
            console.log('Directory', path, 'has been removed');
            RunCommands(Config.File.Commands.Remove).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
        
    });

    Watcher.on('error', function(error) {
        console.error('Error happened', error);
    });
}

if (BrowserSync) {
    BrowserSync.init({
        server: Config.Web.Path,
        port: 5500
    });
}

function ReloadWeb() {
    setTimeout(BrowserSync.reload(), Config.Web.ReloadDelay * 1000 + 1); // We use +1 to ensure the timeout is never 0
}

function RunCommands(commands) {
    Configs = Config;
    return new Promise(function(resolve, reject) {
        commands.forEach(function(command) {
            try {
                ExecuteCommand(command[0], command[1]).then(function(result) {
                    if (result == true) {
                        resolve(true);
                    } else {
                        reject(command);
                    }
                });
            } catch (e) {
                console.log(e.message);
                reject(command);
            }
        });
    });
}

function ExecuteCommand(command, delay) {
        return new Promise(function(resolve, reject) {
            if (!command) {
                throw new Error("Invalid Command Config (Command Missing)");
            }

            if (delay != 0 && !delay) {
                throw new Error("Invalid command Config (Delay Missing): " + command);
            }

            setTimeout(function() {
                console.log("Running Command: " + command);
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(`exec error: ${error}`)
                    }
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    resolve(true)
                });
            }, delay * 1000);
        });
}

// Supress non-breaking error message from fs.
function logErr(response) {
    if (response != "TypeError [ERR_INVALID_CALLBACK]: Callback must be a function") {
        console.log("An Error Occurred: " + response);
    }
}