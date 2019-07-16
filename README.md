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
> ```[
>   "", **--Empty strings will be ignored automatically.**
>   "*.css", **--Ignore all CSS files**
>   "\**/tests/\**/*", **--Ignore the tests directory.**
>  "readme.md" **--Ignore any files called readme.md.**
> ]```