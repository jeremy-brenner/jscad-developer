import { writable } from 'svelte/store';
const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');

const settings = require('electron-settings');

const defaultConfig = {
    startDirBehavior: 'remember'
}
const startupConfig = settings.get('config', defaultConfig );

console.log({dir: initialDirectory()});

const currentFileStore = writable();
const currentDirStore = writable(initialDirectory() || homedir);
const fileListStore = writable([]);
const configStore = createConfigStore();


let watcher;


currentDirStore.subscribe(currentDir => {
    watcher && watcher.close();

    loadDir(currentDir);

    watcher = watch(currentDir, () => {
        loadDir(currentDir);
    });

});

function initialDirectory() {
    return startupConfig.startDirBehavior == 'remember' ? 
        settings.get('currentDir') :
        startupConfig.startDir
}

function createConfigStore() {
 	const { subscribe, update } = writable(startupConfig);

    const updateKey = (key,value) => {
        update(config => {
            const newConfig = Object.assign(config, {[key]:value})
            settings.set('config', newConfig);
            return newConfig;
        });
    }

    const toggleKey = key => {
        update(config => {
            const newConfig = Object.assign(config, {[key]: !config[key] })
            settings.set('config', newConfig);
            return newConfig;
        });
    }

	return {
        subscribe,
        updateKey,
        toggleKey
	};
}


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

export {
    currentFileStore, 
    currentDirStore, 
    fileListStore,
    configStore
}