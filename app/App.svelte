<script>
    import FileList from './FileList.svelte';
    import FileView from './FileView.svelte';
    import FileLoader from './FileLoader.svelte';
    import { createFileStore } from './stores.js';

    let socket;
    let interval;
    let fileStores = [];
   setupSocket();
   
   function setupSocket() {
        if(socket && socket.readyState < 2) {
            clearInterval(interval);
            return;
        }
        socket = new WebSocket("ws://localhost:3000");

        socket.onopen = (event) => {
            console.log('socket opened')
        };

        socket.onclose = (event) => {
            if(interval==undefined){
                interval = setInterval(() => setupSocket(), 1000);
            }
        };

        socket.onmessage =  (msg) => {
            handleEvent(JSON.parse(msg.data));
        }
   }

   function handleEvent(event) {
       if(event.type == "list") {
           fileStores = event.urls.map(url => createFileStore({url,type: "unknown"}))
       }
       if(event.url) {
           updateFileStatus(event.url,event.type,event.message);
       }
   }

   function updateFileStatus(url,type,message) {
       const fileStore = fileStores.find( fileStore => fileStore.url() == url );
       console.log({fileStore});
       if(fileStore) {
           fileStore.set({url,type,message})
       }else{
           fileStores.push(createFileStore({url,type,message}))
       }
   }

</script>


<main>
  <FileList fileStores="{fileStores}"></FileList>
  <FileView></FileView>
  <FileLoader></FileLoader>
</main>

<style>
	
</style>