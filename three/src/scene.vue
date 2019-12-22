<template>
	<div>
		<div id="container" style="width: 1000px; height: 500px"></div>
		<div v-if="three.renderer != false">
			<three-world :three="three"></three-world>
			<three-object ref="element" v-for="ob in objects" :three="three" :object="ob"></three-object>
		</div>
	</div>
</template>

<script>
module.exports = {
	components: {
		threeWorld: httpVueLoader(threeBase + 'world.vue'),
		threeObject: httpVueLoader(threeBase + 'object.vue'),
	},
	data: function() {
		return {
			sizes: {
				w: 0,
				h: 0
			},
			three: {
				scene: false,
				camera: false,
				renderer: false,
				cc: false,
				raycaster: false,
				mouse: false
			}
		}
	},
	mounted: function() {

		this.sizes.w = $('#container').width();
		this.sizes.h = $('#container').height();

		this.init3D();

	},
	methods: {
		animate: function() {

			requestAnimationFrame( this.animate );

			_.each(this.$refs.element, function(a) {
				if(a.tick != undefined)
					a.tick();
			}.bind(this));

			this.three.cc.update();

			this.three.renderer.render( this.three.scene, this.three.camera );

		},
		init3D: function() {

			var w = this.sizes.w;
			var h = this.sizes.h;

			var scene = new THREE.Scene();

			var aspect = w/h;
			var d = 7;
			
			// RENDERER
			var renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
			renderer.setSize( w, h );

			renderer.shadowMap.enabled = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			renderer.gammaInput = true;
			renderer.gammaOutput = true;

			// HELPERS
			scene.add( new THREE.AxesHelper( 40 ) );

			// CAMERA
			var camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 1000 );
			camera.position.set( 20, 20, 20 );
			camera.rotation.x = Math.PI;

			// LIGHTS
			var ambient = new THREE.AmbientLight( 0xffffff, 0.1 );
			scene.add( ambient );

			var spotLight = new THREE.SpotLight( 0x00bcd4, 1 );
			spotLight.position.set( 15, 40, 35 );
			spotLight.angle = Math.PI / 4;
			spotLight.penumbra = 0.5;
			spotLight.decay = 1.7;
			spotLight.distance = 200;
			spotLight.castShadow = true;
			spotLight.shadow.mapSize.width = 1024;
			spotLight.shadow.mapSize.height = 1024;
			spotLight.shadow.camera.near = 10;
			spotLight.shadow.camera.far = 200;
			scene.add( spotLight );


			this.three.scene = scene;
			this.three.camera = camera;
			this.three.renderer = renderer;
			this.three.raycaster = new THREE.Raycaster();
			this.three.mouse = new THREE.Vector2();

			this.three.cc = new OrbitControls( this.three.camera, this.three.renderer.domElement );
			this.three.cc.enableZoom = true;
			this.three.cc.enablePan = true;
			this.three.cc.maxPolarAngle = Math.PI / 2;
			this.three.cc.addEventListener( 'change', function(i) { console.log(this.three.camera); }.bind(this));


			var dom = $("#container", this.$el)[0];

			dom.appendChild( renderer.domElement );
			dom.addEventListener( 'click', this.mousePick, false );
			dom.addEventListener( 'touchend', this.touchPick, false );

			this.animate();

		}
	},
	computed: {
		objects: function() {

			var types = this.w.base_objects;
			var objects = [];

			_.each(types, function(type) {

				_.each(this.w[type], function(singleObject) {
					objects.push(singleObject);
				}.bind(this));

			}.bind(this))

			return objects;
		}
	},
	props: []
}
</script>