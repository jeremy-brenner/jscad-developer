import { writable } from 'svelte/store';

const currentFileStore = writable();
const currentGeometryStore = writable();

function createFileStore(values) {
    const { subscribe, set, update } = writable(values);
    let url = values.url;
    console.log(values);
    return {
        subscribe,
        set: (values) => {
            url = values.url;
            set(values);
        },
        url: () => url
    };
    
}


export { currentFileStore, currentGeometryStore, createFileStore}