import { writable } from 'svelte/store';
const esprima = require('esprima');
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
const statusStore = writable("startup");


let dirWatcher;


currentDirStore.subscribe(currentDir => {
    dirWatcher && dirWatcher.close();

    loadDir(currentDir);

    dirWatcher = watch(currentDir, () => {
        loadDir(currentDir);
    });

});


currentFileStore.subscribe( fullPath => { 
    if(fullPath) { 
      currentFileDataStore.fileChange(fullPath);
    }
});

function getAllIncludes(folder,script) {
    return getIncludes(script).reduce((acc,cur) => {
        const fileData = fs.readFileSync(path.join(folder,cur));
        const subIncludes = getAllIncludes(folder, new TextDecoder("utf-8").decode(fileData));
        return [...acc,cur,...subIncludes];
    }, []);

}

function getIncludes(script) {
    try {
        return esprima.tokenize(script).reduce((acc,cur,i,all) => {
            if( cur.type == 'Identifier' && 
                cur.value == 'include' &&
                all[i+2].type == 'String' ) {
                return [...acc, all[i+2].value.slice(1, -1)];
        }
        return acc;
        }, []);
    } catch {
        return [];
    }

}

function createCurrentFileDataStore() {
    const { subscribe, set } = writable({});

    let fileWatchers = {};

    const fileChange = (fullPath) => {
        Object.values(fileWatchers).forEach( w => w.close() )
        fileWatchers = {};
        fileWatchers[fullPath] = watch(fullPath, () => currentFileDataStore.fileChange(fullPath) );

        const fileData = fs.readFileSync(fullPath);
        const data = new TextDecoder("utf-8").decode(fileData);
        const folder = path.dirname(fullPath);
        getAllIncludes(folder,data).forEach(include => {
            const watchPath = path.join(folder,include);
            if(!fileWatchers[watchPath]) {
                fileWatchers[watchPath] = watch(watchPath, () => currentFileDataStore.fileChange(fullPath) );
            }
        })
        set({
            data,
            fullPath
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
    configStore,
    statusStore
}