<script>    
  import File from './File.svelte';

  export let fileStores;
  let show = true;

  function showHide() {
      show = !show;
  }
</script>

<div>
    <filelist class:show="{show}">
    {#each fileStores as fileStore}
        <File fileStore={fileStore}></File>
    {/each}
    </filelist>
    <showHide on:click="{showHide}">
        {#if show}
            &lt;
        {:else}
            &gt;
        {/if}
    </showHide>
</div>

<style>
    div {
        position: absolute;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
    }

    filelist {
        width: 40%;
        height: 100%;
        display: none;
        border-right: 1px solid black;
        background-color: white;
    }

    filelist.show {
        display: inline-block;
    }
    
    showHide {      
        display: inline-block;
        position: absolute;
        top: 45%;
        border: 1px solid black;
        padding: 30px 3px 30px 3px;
        cursor: pointer;     
        background-color: white;

    }

</style>