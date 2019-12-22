<template>
	<div>
		<div ref="o" v-if="object.threejs" :is="object.threejs" :three="three" :object="object"></div>
	</div>
</template>

<script>
module.exports = {
	components: {
		humanStorytellerThree: httpVueLoader(threeBase + 'story-teller.vue'),
		piantagioneThree: httpVueLoader(threeBase + 'piantagione.vue')
	},
	data: function() {
		return {
			ob: false
		}
	},
	mounted: function() {

		if(this.object.threejs == undefined) {

			this.createObj();
			console.log(this.object);

		}

	},
	methods: {
		createObj: function() {

			var geometry = new THREE.BoxGeometry( 1, _.random(1, 3), 1 );
			var material = new THREE.MeshPhongMaterial( { color: 0xFFFFFF, dithering: true } );
			var cube = new THREE.Mesh( geometry, material );
			this.ob = cube;
			this.ob.position.x = _.random(-8, 8);
			this.ob.position.z = _.random(-8, 8);
			this.ob.position.y = 2.5;
			this.ob.castShadow = true;
			this.ob.receiveShadow = true;
			this.ob.userData = { pickable: true };

			this.three.scene.add( this.ob );

		},
		tick: function() {
			if(this.$refs.o.tick != undefined)
				this.$refs.o.tick();
		},
	},
	props: ['three', 'object']
};
</script>