# sds-toolkit

A live reload web server with built in command processing, command delays, and smart reloading. sds-toolkit is built on node.js utilizing Chokidar and Browsersync for file tracking and automatic page reload features respectively.


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


# Installation

**NPM**

> npm install https://github.com/babel5405/sds-toolkit.git

> Edit the config located with the index.json as described below, then start with node ./

**YARN**

> yarn add https://github.com/babel5405/sds-toolkit.git

> Edit the config located with the index.json as described below, then start with node ./

**GIT**
> git clone https://github.com/babel5405/sds-toolkit.git

> Edit the config located with the index.json as described below, then start with node ./


# Configuration Settings

```json
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
        "IgnoreDots": true,
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


# Configuration Walkthrough


**Web**
---

> **"Enable":**
> Enable or Disable the integrated web server. Set this to false if you don't want to use the built in web server. (Note that this means you won't have automatic reloading in web projects unless you're using another solution.)

> **"Path":**
> File path where the files the integrated web server should serve are located. This may or may not be your working directory depending on your setup and workflow.

> **"Port":**
> Port the web server should be exposed on. This will allow you to control external access to the development server.

> **"ReloadDelay":**
> How long sds-toolkit should wait after commands have executed before reloading the page. This is for compatability, as the page should reload once after each command has completed, but some commands may not report back correctly.

**File**
---

> **"Enable":**
> Enable or Disable the integrated file watcher. I honestly don't know why you would disable this, without it sds-toolkit won't do anything except serve the web files statically without automatic reloading.

> **"Path":**
> File path where the files the file watcher should track are located. This may or may not be your working directory depending on your setup and workflow.

> **"Excluded":**
> This is an array of files, extensions, and directories to ignore.
> 
> **Example (Don't copy-paste this into your config, it won't work.)**
> ```
> [
>   "",                     **--Empty strings will be ignored automatically.**
>   "**.css",                **--Ignore all CSS files. (Note that both *'s are required.)**
>   "\**/tests/\**/*",      **--Ignore the tests directory.**
>  "readme.md",             **--Ignore any files called readme.md.**
>  "^[a-z]$"                **--Ignore any files that match a regex rule. (Be careful when using regex, as json doesn't always play nice with the syntax.)**
> ]
> ```

> **"IgnoreDots":**
> True or False. This will automatically apply the regex string /(^|[\/\\])\../ as an excluded file.

> **"Commands":**
> This section is separated into three array's with arrays of commands, it's the most complicated portion of the config file.
> 
> **Example (Don't copy-paste this into your config, it won't work.)**
> ```
> "Commands": {                                        **--This is the opening block of this section.**
>           "Add": [                                   **--This is the array which houses each command for the file added event.**
>               ["echo test", 0],                      **--This is a basic command, it does it's thing and has a delay of 0 seconds.**
>               ["echo test", 1],                      **--This is the same as the command above, except it has a delay of one second.**
>               ["lessc main.less main.css", 0],       **--This command uses file paths, all paths will be relative to the current working directory (cwd) of sds-toolkit.**
>               ["echo 'test 2'", 1],                  **--This command needs a string which must be quoted, it uses single quotes to avoid conflicts with the json syntax.**
>               ["echo completed", 0]                  **--This command is the last command, it doesn't have a comma (,) after it because it's the end of the list.**
>           ],
>           "Remove": [                                **--This is the array which houses each command for the file removed event.**
>               ["echo test", 0]
>           ],
>           "Save": [                                  **--This is the array which houses each command for the file changed event.**
>               ["echo test", 0]
>           ]
>       }
> ```

**Log**
---

> **"Verbose":**
> True or False. This tells sds-toolkit whether it should output all events or not. Turned on, it will output every time a file is added or changed or a command is ran. (This includes during startup.)
> 
> Note however that command output and page reload notices will be shown regardless of whether this is true or false.