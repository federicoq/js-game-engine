<template>
	<div>
		world
	</div>
</template>

<script>
module.exports = {
	components: {
	},
	data: function() {
		return {

		}
	},
	mounted: function() {

		this.createObj();
		console.log(this.three);

	},
	methods: {
		createObj: function() {
			/*
			var geometry = new THREE.BoxGeometry( 5, 5, 5 );
			var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, dithering: true } );
			var cube = new THREE.Mesh( geometry, material );
			this.object = cube;
			
			this.object.position.y = 2.5;
			this.object.castShadow = true;
			this.object.receiveShadow = true;
			this.object.userData = { pickable: true };

			this.three.scene.add( this.object );
			*/

			var plane = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20, 32 ), new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true } ) );
			plane.rotation.x = -1 * (Math.PI/2);
			plane.receiveShadow = true;
			plane.castShadow = true;
			plane.userData = { pickable: false };

			this.three.scene.add(plane);

		},
		animate: function() {},
	},
	props: ['three']
};
</script>