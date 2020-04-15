<script>
  import { currentFileStore } from './stores.js';

  let jscadIframe;
  let storeUnsubscribe;

  currentFileStore.subscribe( (fileStore) => { 
      if(storeUnsubscribe) {
          storeUnsubscribe();
      }
       if(fileStore) {
           storeUnsubscribe = fileStore.subscribe( file => {
               if(file) {
                  jscadIframe.contentWindow.postMessage(file.url)
               }
           });
       }
   });



</script>
<iframe title="jscad" src="/jscad/viewer-options.html" bind:this={jscadIframe} scrolling="no"></iframe>

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