<script>
  import { statusStore } from './stores.js';
</script>

<status>
  {$statusStore}
</status>

<style>
  status {
    display: block;
    position: absolute;
    right: 10px;
    top: 10px;
  }
</style>