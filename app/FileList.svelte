<script>    
    import File from './File.svelte';
    import { fileListStore } from './stores.js';

    let show;

    function showHide() {
        show = !show;
    }
</script>

<div>
    <filelist class:show="{show}">
    {#each $fileListStore as file}
        <File file={file}/>
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
        pointer-events:none; 
        touch-action:none;
    }

    filelist {
        height: 100%;
        display: none;
        border-right: 1px solid black;
        background-color: white;
        overflow-x: scroll;
    }

    filelist.show {
        display: inline-block;
        pointer-events: auto; 
        touch-action: auto;
    }
    
    showHide {      
        display: inline-block;
        position: absolute;
        top: 45%;
        border: 1px solid black;
        border-left-width: 0px;
        padding: 30px 3px 30px 3px;
        cursor: pointer;     
        background-color: white;
        pointer-events: auto; 
        touch-action: auto;
    }

</style>