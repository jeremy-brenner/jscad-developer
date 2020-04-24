<script>
  import { currentFileDataStore } from './stores.js';
  export let renderStl;

  const fs = require('fs');

  let jscadIframe;
   
  currentFileDataStore.subscribe(({data, fullPath}) => {
     if(!data) {
       return;
     }
     jscadIframe.contentWindow.postMessage({fullPath, 'source': data, renderStl})
  });

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