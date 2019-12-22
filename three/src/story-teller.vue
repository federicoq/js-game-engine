<template>
	<div>
	</div>
</template>

<script>
module.exports = {
	data: function() {
		return {
			ob: false
		}
	},
	mounted: function() {

		this.createObj();
		console.log(this.object);

	},
	methods: {
		createObj: function() {

			var geometry = new THREE.BoxGeometry( 2, 5, 2 );
			var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, dithering: true } );
			var cube = new THREE.Mesh( geometry, material );
			this.ob = cube;
			this.ob.position.x = 0;
			this.ob.position.z = 0;
			this.ob.position.y = 2.5;
			this.ob.castShadow = true;
			this.ob.receiveShadow = true;
			this.ob.userData = { pickable: true };

			this.three.scene.add( this.ob );

		},
		animate: function() {},
	},
	props: ['three', 'object']
};
</script>