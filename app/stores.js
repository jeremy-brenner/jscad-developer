import { writable } from 'svelte/store';
const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');

const settings = require('electron-settings');

const currentFileStore = writable();
const currentDirStore = writable(settings.get('currentDir', homedir));
const fileListStore = writable([]);

let watcher;

currentDirStore.subscribe(currentDir => {
 
    watcher && watcher.close();

    loadDir(currentDir);

    watcher = watch(currentDir, () => {
        loadDir(currentDir);
    });

});

function loadDir(dir) {
    fs.readdir(dir, function(err, items) {
        fileListStore.set(
            [dotDot(dir)].concat(items
                .map(name => {
                    const fullPath = path.join(dir, name)
                    const type = getType(fullPath)
                    return {name, fullPath, type};
                })
                .filter(fileFilter)
            )
        );
    });
}

function fileFilter(info) {
    return (!info.name.startsWith(".") || info.name == "..")
           && ( info.type == "directory" || 
           info.type == "file" && 
           info.name.endsWith(".jscad") );
}

function dotDot(dir) {
    return {
        name: '..',
        fullPath: path.join(dir, '..'),
        type: 'directory'
    }
}

function getType(filePath) {
    let stats
    try {
        stats = fs.statSync(filePath);
    } catch {
        return
    }
    if(stats.isDirectory()) {
        return "directory"
    } 
    if(stats.isFile()) {
        return "file"
    }
    return
}

export {currentFileStore, currentDirStore, fileListStore}