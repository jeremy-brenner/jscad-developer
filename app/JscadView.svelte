<script>
  import { currentFileStore } from './stores.js';
  const fs = require('fs').promises;

  let jscadIframe;
  let storeUnsubscribe;

  currentFileStore.subscribe( (fileStore) => { 
      if(storeUnsubscribe) {
          storeUnsubscribe();
      }
       if(fileStore) {
           storeUnsubscribe = fileStore.subscribe( file => {
               if(file) {
                   fs.readFile(file.url).then(fileData => {
                      jscadIframe.contentWindow.postMessage({'design': file.url, 'source': new TextDecoder("utf-8").decode(fileData)})
                   });
               }
           });
       }
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