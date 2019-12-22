<template>
	<div>
	</div>
</template>

<script>
module.exports = {
	data: function() {
		return {
			ob: false,
			productionProgress: false
		}
	},
	mounted: function() {

		this.createObj();
		console.log(this.object);

	},
	computed: {
		progress: function() {
			if(this.object.production.active.length > 0) {
				return this.object.production.active[0].progress;
			}
			return false;
		},
		state: function() {

			if(this.object.production.active.length == 0) return 0;
			if(this.object.production.active.length > 0) {

				var completed = _.filter(this.object.production.active, { completed: true });

				var wasted = _.filter(this.object.production.active, { wasted: true });
				if(wasted.length > 0) return -1;

				if(completed.length == this.object.production.active.length) return 2;

				return 1;
			}

		}
	},
	watch: {
		progress: function() {

			if(this.progress != false) {
				var y = -0.5 + this.progress/100;
				this.productionProgress.position.y = y;
				//console.log(this.progress);
				//console.log(this.productionProgress.mesh.position)
			} else {
				this.productionProgress.position.y = -0.5;
			}

		},
		state: function() {
			if(this.state == 0)
				this.productionProgress.material.color.setRGB(255,0,0);
			if(this.state == 1)
				this.productionProgress.material.color.setRGB(255,255,0);
			if(this.state == 2)
				this.productionProgress.material.color.setRGB(0,255,0);
			if(this.state == -1)
				this.productionProgress.material.color.setRGB(0,0,0);
		}
	},
	methods: {
		tick: function() {
			// console.log(this.progress);
			//console.log('Hello!');
		},
		createObj: function() {

			var geometry_base = new THREE.BoxGeometry( 1, .1, 1 );
			var material_base = new THREE.MeshPhongMaterial( { color: '#786617', dithering: true } );
			var cube_base = new THREE.Mesh( geometry_base, material_base );

			cube_base.castShadow = true;
			cube_base.userData = { pickable: true };
			//cube.receiveShadow = true;

			// Now, the layer to animate of the... progress! :)
			var geometry_prod = new THREE.BoxGeometry( 0.9, 1, 0.9 );
			var material_prod = new THREE.MeshPhongMaterial( { color: '#786617', dithering: true } );
			var cube_prod = new THREE.Mesh( geometry_prod, material_prod );

			cube_prod.position.y = -0.5;
			cube_prod.castShadow = true;
			cube_prod.userData = { pickable: true };

			this.productionProgress = cube_prod;

			this.ob = new THREE.Group();

			this.ob.add(cube_base);
			this.ob.add(cube_prod);

			this.ob.position.x = -3;
			this.ob.position.z = 6;
			this.ob.position.y = .05;

			this.three.scene.add( this.ob );

		},
	},
	props: ['three', 'object']
};
</script>