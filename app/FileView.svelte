<script>
  import { currentGeometryStore } from './stores.js';
  import { Scene, PerspectiveCamera, WebGLRenderer, LineBasicMaterial, LineSegments } from 'three';
    import { MeshBasicMaterial, Mesh, Group } from 'three';
	import { onMount } from 'svelte';

    const objectGroup = new Group();
   const material = new MeshBasicMaterial( { color: 0x156289 } );

   currentGeometryStore.subscribe( (geometry) => { 
       if(geometry) {
        objectGroup.remove(...objectGroup.children);
        const mesh = new Mesh( geometry, material );
        objectGroup.add(mesh)
       }
   });

	onMount( () => {
  const scene = new Scene();
     const camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
      const renderer = new WebGLRenderer({ 
        canvas: document.getElementById('fileView'),
        alpha: true,
        antialias: true
      });
renderer.setSize( window.innerWidth, window.innerHeight );

        const animate = (t) => {
        requestAnimationFrame( animate );
        objectGroup.rotation.z = t/10000;
        renderer.render( scene, camera );
      };
      scene.add(objectGroup);

    //  objectGroup.rotation.x = -1;
      camera.position.set( 0, 0, 100 );
      animate();




	});
     

 

</script>

<canvas id='fileView'></canvas>


<style>
  #fileView {
    top: 0;
    left: 0;
    z-index: -50;
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
</style>
