<script>
  import { currentFileStore, currentDirStore } from './stores.js';

  export let file;

  function currentStore() {
    return file.type=="file" ? currentFileStore : currentDirStore;
  }

  function setCurrent() {
    currentStore().set(file.fullPath);
  }
</script>

<div on:click='{setCurrent}' class:current={file.fullPath == $currentFileStore}>
  {file.name}
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