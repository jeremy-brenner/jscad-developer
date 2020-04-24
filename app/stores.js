import { writable } from 'svelte/store';
const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path');
const watch = require('node-watch');

const settings = require('electron-settings');

const defaultConfig = {
    startDirBehavior: 'remember',
    startDir: homedir,
    outputStl: false,
    stlDir: homedir
}
const startupConfig = settings.get('config', defaultConfig );

const currentFileStore = writable();
const currentFileDataStore = createCurrentFileDataStore();
const currentDirStore = writable(initialDirectory() || homedir);
const fileListStore = writable([]);
const configStore = createConfigStore();


let dirWatcher;


currentDirStore.subscribe(currentDir => {
    dirWatcher && dirWatcher.close();

    loadDir(currentDir);

    dirWatcher = watch(currentDir, () => {
        loadDir(currentDir);
    });

});

let fileWatcher;

currentFileStore.subscribe( fullPath => { 
    fileWatcher && fileWatcher.close();
    if(fullPath) { 
      fileWatcher = watch(fullPath, () => currentFileDataStore.fileChange(fullPath) );
      currentFileDataStore.fileChange(fullPath);
    }
});


function createCurrentFileDataStore() {
    const { subscribe, set } = writable({});

    const fileChange = (fullPath) => {
        fs.readFile(fullPath, (err,fileData) => {
            set({
                data: new TextDecoder("utf-8").decode(fileData),
                fullPath
            });
        });
    }
	return {
        subscribe,
        fileChange
	};
}


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
    currentFileDataStore,
    currentDirStore, 
    fileListStore,
    configStore
}