# sds-toolkit

A live reload web server with built in command processing, command delays, and smart reloading.

# Features:

 - A file watcher to keep an eye on file changes including addition, edits, and removal.
 - A development web server utilizing BrowserSync.
 - Automatically reloads the page when a file change is detected.
 - Runs command(s) for pre-processing for things like LESS/SCSS and waits until they're complete to reload the page.
 - Allows separate command lists for Adding Files, Changing Files, and Removing Files.
 - Allows custom delays for each command.
 - Allows a delay before reloading the page.
 - Filter files based on type, name, and regex matching.
 - Easily filter DOT files like .gitignore with a single config setting.


# Configuration Settings


```
{
    "Web": {
        "Enable": true,
        "Path": "./",
        "Port": 5500,
        "ReloadDelay": 0
    },
    "File": {
        "Enable": true,
        "Path": "./",
        "Excluded": [
            ""
        ],
        "ignoreDots": true,
        "Commands": {
            "Add": [
                ["echo test", 0]
            ],
            "Remove": [
                ["echo test", 0]
            ],
            "Save": [
                ["echo test", 0]
            ]
        }
    },
    "Log": {
        "Verbose": false
    }
}
```


