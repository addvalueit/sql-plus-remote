# SQLPlus Remote Executor

The "SQLPlus Remote Executor" extension for Visual Studio Code provides a powerful tool for Oracle database developers and administrators who wish to execute SQL scripts remotely using SQLPlus. Integrating directly with VS Code, this extension simplifies the process of connecting and executing SQL scripts on Oracle databases from any location.

## Features

* __Multiple connetion__: Added the possibility to manage multiple connection within differnt DB or schema.

* __Remote Execution__: Use the SQLPlus tool to run SQL scripts directly on your Oracle database, regardless of the physical location of the database using shortcut ```Ctrl+F3```.

* __Connection Management__: Save your favorite connection configurations for quick and hassle-free access to different Oracle databases.

* __Displaying Results__: Display the result directly into VS Code

* __Multi-Database Compatibility__: It supports connecting to several Oracle databases at once, allowing you to work on multiple projects without having to constantly reconfigure connections.

## Requirements

You must have the SQLPlus tool installed on the same machine on which Visual Studio Code is running. SQLPlus is the command-line interface tool provided by Oracle for running SQL commands and scripts on Oracle databases. Make sure the tool is configured correctly and can be run from the command line.

## Extension Settings

This extension contributes the following settings:

* `plsql-executor.sqlplusPath`: Folder in which the SQLPath tool is installed..
* `plsql-executor.defaultProfile`: Default profile for running scripts
* `plsql-executor.profiles`: Array describing the various connection profiles, the profile structure is as follows
```json
"plsql-executor.profiles": [
        {
            "name": "dev",
            "connectionString": {
                "user": "<username>",
                "password": "<password>",
                "dbAddress": "<host>",
                "dbService": "<serviceName>"
            }
        }
    ]
```

## Known Issues

To report any problems please create an issue on the [Repository GitHub](https://github.com/addvalueit/sql-plus-remote/issues)

## Release Notes

### 1.0.0
* [Add configuration contrubutes](https://github.com/giane88/plsql-executor/issues/2)
* [Write readme file](https://github.com/giane88/plsql-executor/issues/3)
* [Add keybindings for running commands](https://github.com/giane88/plsql-executor/issues/4)
* [Manage space in script's path](https://github.com/giane88/plsql-executor/issues/5)

### 2.0.0
* [Add the reload configuration command](https://github.com/addvalueit/sql-plus-remote/issues/5)
* [Changed the banner colour](https://github.com/addvalueit/sql-plus-remote/issues/3)

