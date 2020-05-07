<script>
  import { currentFileDataStore, statusStore } from './stores.js';
  import { onDestroy } from 'svelte';
  export let renderStl;

  const fs = require('fs');

  let jscadIframe;
   
  statusStore.set("ready");

  currentFileDataStore.subscribe(({data, fullPath}) => {
     if(!fullPath) {
       return;
     }
     statusStore.set("loading");
     jscadIframe.contentWindow.postMessage({fullPath, 'source': data, renderStl})
  });

  onDestroy(() => {
    window.removeEventListener("message", (message) => handleMessage(message) );
  });

  window.addEventListener("message", (message) => handleMessage(message) );

  function handleMessage({data}) {
    if(data.action == 'doneRendering') {
      statusStore.set("ready");
    }
  };


</script>

<iframe title="jscad" src="jscad/viewer-options.html" bind:this={jscadIframe} scrolling="no"></iframe>

<style>
  iframe {
      border: none;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
  }
</style>