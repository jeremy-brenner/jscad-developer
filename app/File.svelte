<script>
  import { currentFileStore } from './stores.js';
  export let fileStore;
  let name;
  let current = false;
  const re = /models\/(.*)\.jscad/;

  fileStore.subscribe(file => name = getName(file.url))
   
  currentFileStore.subscribe(fs => current = fs == fileStore);

  function getName(url) {
    return re.exec(url)[1];
  }

  function setCurrent() {
      currentFileStore.set(fileStore);
  }
</script>

<div on:click='{setCurrent}' class:current={current}>
  {name}
</div>

<style>
  div {
      display: block;
      cursor: pointer;
      padding: 5px 0px 5px 10px
  }
  .current {
    background-color: #156289;
    color: white;
  }
</style>