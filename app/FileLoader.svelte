<script>
  import { currentFileStore, currentGeometryStore } from './stores.js';
  import * as THREE from 'three';

  import almostStlLoader from 'three-stl-loader';
  const STLLoaderC = almostStlLoader(THREE);
  const loader = new STLLoaderC();

  currentFileStore.subscribe( (fileStore) => { 
       if(fileStore) {
           fileStore.subscribe( file => {
               if(file) {
            console.log('did', file)
            loader.load( file.url, geometry =>  currentGeometryStore.set(geometry));
               }
           });

       }
       
   });



</script>