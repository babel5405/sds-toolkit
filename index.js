const { exec } = require('child_process');
let Config = require("./config.json");
const {resolve} = require("path");
let History =  require("connect-history-api-fallback");
let Chokidar = null;
let BrowserSync = null;

// Resolve relative paths to aboslute so we can
// allow users to provide relative directories.
Config.Web.Path = resolve(Config.Web.Path);
Config.File.Path = resolve(Config.File.Path);

if (Config.Web.Enable) {
    BrowserSync = require("browser-sync").create();
}

if (Config.File.Enable) {
    Chokidar = require("Chokidar");
}

if (Chokidar != null) {
    let Watcher;
    let ready = false;

    while (Config.File.Excluded.indexOf("") != -1) {
        Config.File.Excluded.splice(Config.File.Excluded.indexOf(""), 1)
    }

    if (Config.File.IgnoreDots == true) {
        Config.File.Excluded.push(/(^|[\/\\])\../);
    }

    if (Config.File.Excluded.length > 0) {
        console.log("\u001b[34m==================================================================================");
        console.log("\u001b[1mLoading File Watcher");
        console.log("Path: \u001b[32m" + Config.File.Path)
        console.log("\u001b[34m==================================================================================");
        console.log("The following files are being excluded:");
        console.log("\u001b[34m==================================================================================");
        Config.File.Excluded.forEach(function(file) {
            console.log("\u001b[33m" + file);
        });
        console.log("\u001b[34m==================================================================================");
        Watcher = Chokidar.watch(Config.File.Path, {ignored: Config.File.Excluded, persistent: true});
    } else {
        console.log("\u001b[34m==================================================================================");
        console.log("\u001b[1mLoading File Watcher");
        console.log("Path: \u001b[32m" + Config.File.Path)
        console.log("\u001b[34m==================================================================================");
        Watcher = Chokidar.watch(Config.File.Path, {persistent: true});
    }

    Watcher.on('ready', function() {
        console.log("\u001b[34m==================================================================================");
        console.log("\u001b[1mFile Watcher Loaded");
        console.log("\u001b[34m==================================================================================");
        ready = true;

        // Start the Web Server after the File Watcher Loads:
        if (BrowserSync) {
            StartBrowserSync()
        }
    })

    Watcher.on('add', function(path) {
            if (Config.Log.Verbose) {
                console.log('\u001b[32mFile', path, 'has been added');
            }
            if (ready) {
                RunCommands(Config.File.Commands.Add).then(function(response) {
                    ReloadWeb()
                }).catch(function(response) {
                    logErr(response);
                });
            }
    });

    Watcher.on('addDir', function(path) {
        if (Config.Log.Verbose) {
            console.log('\u001b[32mDirectory', path, 'has been added');
        }
        if (ready) {
            RunCommands(Config.File.Commands.Add).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
    });

    Watcher.on('change', function(path) {
        if (Config.Log.Verbose) {
            console.log('\u001b[33mFile', path, 'has been changed');
        }
        if (ready) {
            RunCommands(Config.File.Commands.Save).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
        
    });

    Watcher.on('unlink', function(path) {
        if (Config.Log.Verbose) {
            console.log('\u001b[31mFile', path, 'has been removed');
        }
        if (ready) {
            RunCommands(Config.File.Commands.Remove).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
        
    });

    Watcher.on('unlinkDir', function(path) {
        if (Config.Log.Verbose) {
            console.log('\u001b[31mDirectory', path, 'has been removed');
        }
        if (ready) {
            RunCommands(Config.File.Commands.Remove).then(function(response) {
                ReloadWeb()
            }).catch(function(response) {
                logErr(response);
            });
        }
        
    });

    Watcher.on('error', function(error) {
        console.log("\u001b[31m==================================================================================");
        console.log("==================================================================================");
        console.log("\u001b[31m==================================================================================");
        console.error('\u001b[33mError happened', error);
        console.log("\u001b[31m==================================================================================");
        console.log("==================================================================================");
        console.log("\u001b[31m==================================================================================");
    });
}

if (BrowserSync && !Chokidar) {
    StartBrowserSync()
}

function StartBrowserSync() {
    if (Config.Web.EnableHistoryAPI == true) {
        if (Config.Web.ConnectHistoryAPIFallbackRewrites != null) {
            BrowserSync.init({
                server: {
                    baseDir: Config.Web.Path,
                    middleware: [
                        History({
                            rewrites: Config.Web.ConnectHistoryAPIFallbackRewrites
                        })
                    ]
                },
                port: Config.Web.Port

            });
        } else {
            BrowserSync.init({
                server: {
                    baseDir: Config.Web.Path,
                    middleware: [
                        History()
                    ]
                },
                port: Config.Web.Port
            });
        }
    } else {
        BrowserSync.init({
            server: Config.Web.Path,
            port: Config.Web.Port
        });
    }
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